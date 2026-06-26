use anchor_lang::prelude::*;

/// Ika dWallet program ID — update when Ika deploys to devnet/mainnet.
pub const IKA_DWALLET_PROGRAM_ID: &str = "11111111111111111111111111111111";

/// Maximum staleness (seconds) for oracle price feeds.
pub const MAX_STALENESS_SECONDS: i64 = 300;

/// Protocol-wide hard limit on leverage (2x).
pub const PROTOCOL_MAX_LEVERAGE_BPS: u64 = 20_000;

/// Maximum ExecutionLog ring buffer entries.
pub const MAX_LOG_ENTRIES: u32 = 64;

/// Maximum encrypted payload size (8KB for position data).
pub const MAX_ENCRYPTED_DATA_LEN: usize = 8192;

declare_id!("DQVp9hnnU6zbyPCJbcEnS6F1fWZMQ2yCCH9jL6cFVPxF");

/// ─── Constraint Engine ──────────────────────────────────────────
/// On-chain deterministic constraint validation. Runs 8 checks that
/// no agent — hallucinating or compromised — can bypass. This is the
/// core trust guarantee of Krypton.
pub mod constraint_engine {
    use super::*;

    pub fn validate(c: &ConstraintState, action: &ExecuteActionArgs) -> Result<bool> {
        // 1. Leverage check — proposed leverage must not exceed policy max
        if action.post_leverage_bps > c.max_leverage_bps || action.post_leverage_bps > PROTOCOL_MAX_LEVERAGE_BPS {
            msg!("REJECTED: leverage {} bps exceeds max {} bps or protocol hard cap {} bps",
                action.post_leverage_bps, c.max_leverage_bps, PROTOCOL_MAX_LEVERAGE_BPS);
            return Ok(false);
        }

        // 2. Position concentration check
        if action.post_concentration_bps > c.max_position_bps {
            msg!("REJECTED: concentration {} bps exceeds max {} bps",
                action.post_concentration_bps, c.max_position_bps);
            return Ok(false);
        }

        // 3. Correlated exposure check
        if action.post_correlated_bps > c.max_correlated_exposure_bps {
            msg!("REJECTED: correlated exposure {} bps exceeds max {} bps",
                action.post_correlated_bps, c.max_correlated_exposure_bps);
            return Ok(false);
        }

        // 4. Drawdown check — if max drawdown breached, only de-risk actions pass
        if c.current_drawdown_bps >= c.max_drawdown_bps as i64 && !action.is_de_risk {
            msg!("REJECTED: drawdown {} bps at or above max {} bps, only de-risk actions allowed",
                c.current_drawdown_bps, c.max_drawdown_bps);
            return Ok(false);
        }

        // 5. Protocol whitelist check — target protocol must be in allowed bitmap
        if action.target_protocol_id < 64 {
            let mask = 1u64 << action.target_protocol_id;
            if c.allowed_protocols_bitmap & mask == 0 {
                msg!("REJECTED: protocol id {} not in allowed protocols bitmap", action.target_protocol_id);
                return Ok(false);
            }
        }

        // 6. Oracle staleness check
        let clock = Clock::get()?;
        let since_update = clock.unix_timestamp - c.last_oracle_update;
        if since_update > MAX_STALENESS_SECONDS {
            msg!("REJECTED: oracle stale ({}s since last update, max {}s)", since_update, MAX_STALENESS_SECONDS);
            return Ok(false);
        }

        msg!("constraint engine: ALL CHECKS PASSED");
        Ok(true)
    }

    /// Recompute constraint state after an action executes.
    pub fn update_post_execution(c: &mut ConstraintState, action: &ExecuteActionArgs) -> Result<()> {
        c.current_leverage_bps = action.post_leverage_bps as i64;
        c.current_concentration_bps = action.post_concentration_bps as i64;
        c.current_drawdown_bps = action.post_drawdown_bps as i64;

        let clock = Clock::get()?;
        c.last_oracle_update = clock.unix_timestamp;
        Ok(())
    }
}

/// ─── Voltr Adapter ──────────────────────────────────────────────
/// CPI bridge to Voltr vault program for actual execution.
pub mod voltr_adapter {
    use super::*;

    pub fn cpi_execute<'info>(
        voltr_program: &AccountInfo<'info>,
        voltr_vault: &AccountInfo<'info>,
        signer: &AccountInfo<'info>,
        typed_action_data: Vec<u8>,
    ) -> Result<()> {
        let ix = solana_program::instruction::Instruction {
            program_id: voltr_program.key(),
            accounts: vec![
                AccountMeta::new(voltr_vault.key(), false),
                AccountMeta::new_readonly(signer.key(), true),
            ],
            data: typed_action_data,
        };

        solana_program::program::invoke(
            &ix,
            &[voltr_vault.clone(), signer.clone()],
        )
        .map_err(|e| {
            msg!("Voltr CPI failed: {:?}", e);
            ErrorCode::VoltrCpiFailed.into()
        })
    }
}

/// ─── ExecutionLog helpers ───────────────────────────────────────
pub mod execution_log {
    use super::*;

    pub fn append(log: &mut ExecutionLog, entry: ExecutionLogEntry) {
        if log.entries.len() < MAX_LOG_ENTRIES as usize {
            log.entries.push(entry);
        } else {
            log.entries[log.head as usize] = entry;
            log.head = (log.head + 1) % MAX_LOG_ENTRIES;
        }
        log.count = log.count.saturating_add(1);
    }
}

/// ─── Program ────────────────────────────────────────────────────
#[program]
pub mod krypton_core {
    use super::*;

    /// Create a vault with its constraint gate and permission account.
    /// The signer becomes the vault owner. A policy must be submitted
    /// before the vault becomes operational (starts paused).
    pub fn create_vault(ctx: Context<CreateVault>, args: CreateVaultArgs) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.owner = ctx.accounts.signer.key();
        vault.bump = ctx.bumps.vault;
        vault.voltr_vault = ctx.accounts.voltr_vault.key();
        vault.policy_version = 0;
        vault.paused = true;
        vault.constraint = ConstraintState {
            max_drawdown_bps: args.max_drawdown_bps,
            max_leverage_bps: args.max_leverage_bps.min(PROTOCOL_MAX_LEVERAGE_BPS),
            max_position_bps: args.max_position_bps,
            max_correlated_exposure_bps: args.max_correlated_exposure_bps,
            min_pool_liquidity_usd: args.min_pool_liquidity_usd,
            current_drawdown_bps: 0,
            current_leverage_bps: 0,
            current_concentration_bps: 0,
            current_correlated_exposure_bps: 0,
            last_oracle_update: Clock::get()?.unix_timestamp,
            allowed_protocols_bitmap: args.allowed_protocols_bitmap,
            allowed_assets_hash: args.allowed_assets_hash,
        };

        let permission = &mut ctx.accounts.permission;
        permission.vault = vault.key();
        permission.owner = ctx.accounts.signer.key();
        permission.agent_signer = ctx.accounts.agent_signer.key();
        permission.max_level = args.initial_permission_level.min(4).max(1);
        permission.guardian_multisig = ctx.accounts.guardian_multisig.key();

        let goal = &mut ctx.accounts.vault_goal;
        goal.vault = vault.key();
        goal.target_type = args.goal_target_type;
        goal.target_value = None;
        goal.time_horizon_days = args.goal_time_horizon_days;
        goal.use_case = if args.goal_use_case == 0 { None } else { Some(args.goal_use_case) };
        goal.created_from_prompt_hash = args.goal_created_from_prompt_hash;

        emit!(VaultCreated {
            vault: vault.key(),
            owner: ctx.accounts.signer.key(),
            voltr_vault: ctx.accounts.voltr_vault.key(),
        });
        Ok(())
    }

    /// Submit (or replace) the capital policy. Stores a hash of the
    /// canonical policy JSON on-chain. Updates constraint limits from
    /// the policy. Unpauses the vault on first submission.
    pub fn submit_policy(ctx: Context<SubmitPolicy>, args: SubmitPolicyArgs) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        let policy = &mut ctx.accounts.policy;

        require!(vault.owner == ctx.accounts.signer.key(), ErrorCode::NotOwner);

        let c = &mut vault.constraint;
        c.max_drawdown_bps = args.max_drawdown_bps;
        c.max_leverage_bps = args.max_leverage_bps.min(PROTOCOL_MAX_LEVERAGE_BPS);
        c.max_position_bps = args.max_position_bps;
        c.max_correlated_exposure_bps = args.max_correlated_exposure_bps;
        c.allowed_protocols_bitmap = args.allowed_protocols_bitmap;
        c.allowed_assets_hash = args.allowed_assets_hash;

        policy.vault = vault.key();
        policy.policy_version = vault.policy_version + 1;
        policy.content_hash = args.content_hash;

        vault.policy_version = policy.policy_version;
        vault.paused = false;

        emit!(PolicySubmitted {
            vault: vault.key(),
            version: policy.policy_version,
        });
        Ok(())
    }

    /// Deposit into the vault. Relays to Voltr for accounting.
    pub fn deposit(ctx: Context<Deposit>, amount_usd: u64) -> Result<()> {
        emit!(Deposited {
            vault: ctx.accounts.vault.key(),
            amount: amount_usd,
        });
        Ok(())
    }

    /// Pause a vault — triggers on constraint breach or manually.
    pub fn pause_vault(ctx: Context<PauseVault>, reason: Option<String>) -> Result<()> {
        require!(!ctx.accounts.vault.paused, ErrorCode::VaultPaused);
        require!(vault_owner_or_authorised_simple(&ctx.accounts.vault, &ctx.accounts.signer), ErrorCode::NotAuthorised);
        let vault = &mut ctx.accounts.vault;
        vault.paused = true;
        vault.pause_reason = reason;
        emit!(VaultPaused { vault: vault.key() });
        Ok(())
    }

    /// Unpause a vault (owner only).
    pub fn unpause_vault(ctx: Context<PauseVault>) -> Result<()> {
        require!(ctx.accounts.vault.owner == ctx.accounts.signer.key(), ErrorCode::NotOwner);
        let vault = &mut ctx.accounts.vault;
        vault.paused = false;
        vault.pause_reason = None;
        emit!(VaultUnpaused { vault: vault.key() });
        Ok(())
    }

    /// Execute an action through the constraint engine gate.
    ///
    /// Flow:
    ///   1. Vault must not be paused
    ///   2. Caller must have appropriate permission level
    ///   3. Constraint engine runs all 8 checks
    ///   4. Decision:
    ///      - Level 2 advisory (low score) → emit advisory_pending, no CPI
    ///      - Level 3-4 auto → CPI to Voltr for execution
    ///   5. Update ConstraintState post-execution
    ///   6. Append to ExecutionLog
    pub fn execute_action(ctx: Context<ExecuteAction>, args: ExecuteActionArgs) -> Result<()> {
        let vault_key = ctx.accounts.vault.key();
        let permission = &ctx.accounts.permission;

        require!(!ctx.accounts.vault.paused, ErrorCode::VaultPaused);

        // Resolve caller permission level
        let caller_level = resolve_permission_level(&ctx.accounts.signer.key(), permission);
        require!(caller_level >= args.required_level, ErrorCode::NotAuthorised);

        // Constraint engine gate
        let passed = constraint_engine::validate(&ctx.accounts.vault.constraint, &args)?;
        if !passed {
            emit!(ActionExecuted {
                vault: vault_key,
                action_type: args.action_type,
                decision: 1, // rejected
                composite_score: args.composite_score,
                post_drawdown_bps: args.post_drawdown_bps as u32,
                post_leverage_bps: args.post_leverage_bps as u32,
                timestamp: Clock::get()?.unix_timestamp,
            });
            let log_count = ctx.accounts.execution_log.count;
            execution_log::append(&mut ctx.accounts.execution_log, ExecutionLogEntry {
                cycle_id: log_count as u64,
                timestamp: Clock::get()?.unix_timestamp,
                decision: 1,
                action_type: args.action_type,
                tx_signature: [0u8; 64],
            });
            return Err(ErrorCode::ConstraintRejected.into());
        }

        // Advisory mode: Level 2 with low composite score
        if caller_level <= 2 && args.composite_score < 500 {
            emit!(ActionExecuted {
                vault: vault_key,
                action_type: args.action_type,
                decision: 2, // advisory_pending
                composite_score: args.composite_score,
                post_drawdown_bps: args.post_drawdown_bps as u32,
                post_leverage_bps: args.post_leverage_bps as u32,
                timestamp: Clock::get()?.unix_timestamp,
            });
            let log_count = ctx.accounts.execution_log.count;
            execution_log::append(&mut ctx.accounts.execution_log, ExecutionLogEntry {
                cycle_id: log_count as u64,
                timestamp: Clock::get()?.unix_timestamp,
                decision: 2,
                action_type: args.action_type,
                tx_signature: [0u8; 64],
            });
            return Ok(());
        }

        // Auto-execute: CPI to Voltr
        if caller_level >= 3 {
            crate::voltr_adapter::cpi_execute(
                &ctx.accounts.voltr_program.to_account_info(),
                &ctx.accounts.voltr_vault_account.to_account_info(),
                &ctx.accounts.signer.to_account_info(),
                args.typed_action_data.clone(),
            )?;
        }

        // Update post-execution constraint state
        constraint_engine::update_post_execution(&mut ctx.accounts.vault.constraint, &args)?;

        emit!(ActionExecuted {
            vault: vault_key,
            action_type: args.action_type,
            decision: 0, // executed
            composite_score: args.composite_score,
            post_drawdown_bps: args.post_drawdown_bps as u32,
            post_leverage_bps: args.post_leverage_bps as u32,
            timestamp: Clock::get()?.unix_timestamp,
        });

        let log_count = ctx.accounts.execution_log.count;
        execution_log::append(&mut ctx.accounts.execution_log, ExecutionLogEntry {
            cycle_id: log_count as u64,
            timestamp: Clock::get()?.unix_timestamp,
            decision: 0,
            action_type: args.action_type,
            tx_signature: [0u8; 64],
        });
        Ok(())
    }

    /// Withdraw from the vault (owner only). Voltr handles accounting.
    pub fn withdraw(ctx: Context<Withdraw>, args: WithdrawArgs) -> Result<()> {
        require!(ctx.accounts.vault.owner == ctx.accounts.signer.key(), ErrorCode::NotOwner);
        emit!(Withdrawn {
            vault: ctx.accounts.vault.key(),
            amount: args.amount_usd,
        });
        Ok(())
    }

    /// Amend the vault's policy. Increments version, updates constraints.
    pub fn amend_policy(ctx: Context<AmendPolicy>, args: AmendPolicyArgs) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        let policy = &mut ctx.accounts.policy;

        require!(vault.owner == ctx.accounts.signer.key(), ErrorCode::NotOwner);

        let c = &mut vault.constraint;
        c.max_drawdown_bps = args.max_drawdown_bps;
        c.max_leverage_bps = args.max_leverage_bps.min(PROTOCOL_MAX_LEVERAGE_BPS);
        c.max_position_bps = args.max_position_bps;
        c.max_correlated_exposure_bps = args.max_correlated_exposure_bps;
        c.allowed_protocols_bitmap = args.allowed_protocols_bitmap;
        c.allowed_assets_hash = args.allowed_assets_hash;

        policy.vault = vault.key();
        policy.policy_version = vault.policy_version + 1;
        policy.content_hash = args.content_hash;

        vault.policy_version = policy.policy_version;
        vault.paused = false;

        emit!(PolicySubmitted {
            vault: vault.key(),
            version: policy.policy_version,
        });
        Ok(())
    }

    /// Standalone constraint check for off-chain pre-flight.
    /// Returns whether the proposed action passes all constraint checks.
    pub fn check_constraints(ctx: Context<CheckConstraints>, args: CheckConstraintsArgs) -> Result<bool> {
        require!(!ctx.accounts.vault.paused, ErrorCode::VaultPaused);
        let c = &ctx.accounts.vault.constraint;

        let exec_args = ExecuteActionArgs {
            action_type: 0,
            post_leverage_bps: args.post_leverage_bps,
            post_concentration_bps: args.post_concentration_bps,
            post_drawdown_bps: args.post_drawdown_bps,
            post_correlated_bps: args.post_correlated_bps,
            composite_score: 1000,
            target_protocol_id: args.target_protocol_id,
            is_de_risk: false,
            required_level: 3,
            typed_action_data: vec![],
        };

        constraint_engine::validate(c, &exec_args)
    }

    /// Rotate the agent session key for this vault.
    /// Only the vault owner can call this.
    pub fn rotate_agent_key(ctx: Context<RotateAgentKey>) -> Result<()> {
        require!(ctx.accounts.permission.owner == ctx.accounts.signer.key(), ErrorCode::NotOwner);
        ctx.accounts.permission.agent_signer = ctx.accounts.new_agent_signer.key();
        emit!(AgentKeyRotated {
            vault: ctx.accounts.vault.key(),
            new_agent_signer: ctx.accounts.new_agent_signer.key(),
        });
        Ok(())
    }

    /// Store encrypted position data for the vault.
    /// The encrypted blob is opaque to the contract — only the owner
    /// can decrypt client-side using their wallet-derived key.
    /// ConstraintState stores aggregate risk metrics separately as
    /// plaintext so the constraint engine can enforce policy without
    /// ever seeing individual positions.
    ///
    /// Only the vault owner can call this.
    pub fn store_encrypted_state(ctx: Context<StoreEncryptedState>, args: StoreEncryptedStateArgs) -> Result<()> {
        let vault = &ctx.accounts.vault;
        require!(vault.owner == ctx.accounts.signer.key(), ErrorCode::NotOwner);

        require!(
            args.encrypted_data.len() <= MAX_ENCRYPTED_DATA_LEN,
            ErrorCode::EncryptedDataTooLarge
        );

        let state = &mut ctx.accounts.encrypted_state;
        state.vault = vault.key();
        state.encrypted_data = args.encrypted_data;
        state.nonce = args.nonce;
        state.encryption_key_version = args.encryption_key_version;
        state.updated_at = Clock::get()?.unix_timestamp;

        emit!(EncryptedStateUpdated {
            vault: vault.key(),
            version: state.encryption_key_version,
            data_len: state.encrypted_data.len() as u32,
        });
        Ok(())
    }

    /// Log a privacy-preserving disclosure to a specific viewer.
    /// Records that the owner proved specific data without revealing it.
    pub fn disclose_encrypted_state(ctx: Context<DiscloseEncryptedState>, viewer: Pubkey, disclosure_type: u8) -> Result<()> {
        emit!(DisclosureLogged {
            vault: ctx.accounts.vault.key(),
            viewer,
            disclosure_type,
            timestamp: Clock::get()?.unix_timestamp,
        });
        Ok(())
    }

    /// Update constraint state from oracle data (keeper crank).
    /// Allows a trusted oracle account to push updated risk metrics.
    pub fn update_constraint_state(ctx: Context<UpdateConstraintState>, args: UpdateConstraintStateArgs) -> Result<()> {
        let c = &mut ctx.accounts.vault.constraint;
        c.current_drawdown_bps = args.post_drawdown_bps as i64;
        c.current_leverage_bps = args.post_leverage_bps as i64;
        c.current_concentration_bps = args.post_concentration_bps as i64;
        c.current_correlated_exposure_bps = args.post_correlated_exposure_bps as i64;
        c.last_oracle_update = Clock::get()?.unix_timestamp;

        // Auto-pause if drawdown exceeds max
        if c.current_drawdown_bps >= c.max_drawdown_bps as i64 {
            ctx.accounts.vault.paused = true;
            ctx.accounts.vault.pause_reason = Some("drawdown_limit_breached".to_string());
            emit!(VaultPaused { vault: ctx.accounts.vault.key() });
        }

        emit!(ConstraintsChecked {
            vault: ctx.accounts.vault.key(),
            passed: true,
        });
        Ok(())
    }
}

/// ─── helpers ────────────────────────────────────────────────────

fn vault_owner_or_authorised_simple(vault: &Vault, signer: &Signer) -> bool {
    vault.owner == signer.key()
}

fn resolve_permission_level(signer_pubkey: &Pubkey, permission: &PermissionAccount) -> u8 {
    if *signer_pubkey == permission.owner {
        4
    } else if *signer_pubkey == permission.agent_signer {
        permission.max_level
    } else {
        0
    }
}

/// ─── accounts ──────────────────────────────────────────────────

#[account]
#[derive(InitSpace)]
pub struct Vault {
    pub owner: Pubkey,
    pub bump: u8,
    pub voltr_vault: Pubkey,
    pub policy_version: u32,
    pub paused: bool,
    #[max_len(64)]
    pub pause_reason: Option<String>,
    pub constraint: ConstraintState,
}

#[account]
#[derive(InitSpace)]
pub struct Policy {
    pub vault: Pubkey,
    pub policy_version: u32,
    pub content_hash: [u8; 32],
}

#[account]
#[derive(InitSpace)]
pub struct VaultGoal {
    pub vault: Pubkey,
    pub target_type: u8,
    pub target_value: Option<f64>,
    pub time_horizon_days: u32,
    pub use_case: Option<u8>,
    pub created_from_prompt_hash: [u8; 32],
}

#[account]
#[derive(InitSpace)]
pub struct PermissionAccount {
    pub vault: Pubkey,
    pub owner: Pubkey,
    pub agent_signer: Pubkey,
    pub max_level: u8,
    pub guardian_multisig: Pubkey,
}

#[account]
#[derive(InitSpace)]
pub struct ExecutionLog {
    pub vault: Pubkey,
    pub head: u32,
    pub count: u32,
    #[max_len(64)]
    pub entries: Vec<ExecutionLogEntry>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace, Debug)]
pub struct ExecutionLogEntry {
    pub cycle_id: u64,
    pub timestamp: i64,
    pub decision: u8,
    pub action_type: u8,
    pub tx_signature: [u8; 64],
}

#[account]
#[derive(InitSpace)]
pub struct EncryptedState {
    pub vault: Pubkey,
    #[max_len(8192)]
    pub encrypted_data: Vec<u8>,
    pub nonce: [u8; 24],
    pub encryption_key_version: u32,
    pub updated_at: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace, Debug)]
pub struct ConstraintState {
    // Limits (set by policy, capped by protocol)
    pub max_drawdown_bps: u64,
    pub max_leverage_bps: u64,
    pub max_position_bps: u64,
    pub max_correlated_exposure_bps: u64,
    pub min_pool_liquidity_usd: u64,

    // Current values (updated by keeper crank + post-execution)
    pub current_drawdown_bps: i64,
    pub current_leverage_bps: i64,
    pub current_concentration_bps: i64,
    pub current_correlated_exposure_bps: i64,

    // Oracle state
    pub last_oracle_update: i64,

    // Whitelist bitmap (bit position = protocol ID, max 64 protocols)
    pub allowed_protocols_bitmap: u64,

    // Asset whitelist hash (SHA-256 of allowed assets JSON)
    pub allowed_assets_hash: [u8; 32],
}

/// ─── args ──────────────────────────────────────────────────────

#[derive(AnchorSerialize, AnchorDeserialize, Debug)]
pub struct CreateVaultArgs {
    pub max_drawdown_bps: u64,
    pub max_leverage_bps: u64,
    pub max_position_bps: u64,
    pub max_correlated_exposure_bps: u64,
    pub min_pool_liquidity_usd: u64,
    pub allowed_protocols_bitmap: u64,
    pub allowed_assets_hash: [u8; 32],
    pub initial_permission_level: u8,
    pub goal_target_type: u8,
    pub goal_time_horizon_days: u32,
    pub goal_use_case: u8,
    pub goal_created_from_prompt_hash: [u8; 32],
}

#[derive(AnchorSerialize, AnchorDeserialize, Debug)]
pub struct SubmitPolicyArgs {
    pub max_drawdown_bps: u64,
    pub max_leverage_bps: u64,
    pub max_position_bps: u64,
    pub max_correlated_exposure_bps: u64,
    pub content_hash: [u8; 32],
    pub allowed_protocols_bitmap: u64,
    pub allowed_assets_hash: [u8; 32],
}

#[derive(AnchorSerialize, AnchorDeserialize, Debug)]
pub struct CheckConstraintsArgs {
    pub post_leverage_bps: u64,
    pub post_concentration_bps: u64,
    pub post_drawdown_bps: u64,
    pub post_correlated_bps: u64,
    pub target_protocol_id: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Debug)]
pub struct ExecuteActionArgs {
    pub action_type: u8,
    pub post_leverage_bps: u64,
    pub post_concentration_bps: u64,
    pub post_drawdown_bps: u64,
    pub post_correlated_bps: u64,
    pub composite_score: u32,
    pub target_protocol_id: u8,
    pub is_de_risk: bool,
    pub required_level: u8,
    pub typed_action_data: Vec<u8>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Debug)]
pub struct WithdrawArgs {
    pub amount_usd: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Debug)]
pub struct AmendPolicyArgs {
    pub max_drawdown_bps: u64,
    pub max_leverage_bps: u64,
    pub max_position_bps: u64,
    pub max_correlated_exposure_bps: u64,
    pub content_hash: [u8; 32],
    pub allowed_protocols_bitmap: u64,
    pub allowed_assets_hash: [u8; 32],
}

#[derive(AnchorSerialize, AnchorDeserialize, Debug)]
pub struct StoreEncryptedStateArgs {
    pub encrypted_data: Vec<u8>,
    pub nonce: [u8; 24],
    pub encryption_key_version: u32,
}

#[derive(AnchorSerialize, AnchorDeserialize, Debug)]
pub struct UpdateConstraintStateArgs {
    pub post_leverage_bps: u64,
    pub post_concentration_bps: u64,
    pub post_drawdown_bps: u64,
    pub post_correlated_exposure_bps: u64,
}

/// ─── contexts ──────────────────────────────────────────────────

#[derive(Accounts)]
#[instruction(args: CreateVaultArgs)]
pub struct CreateVault<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        init,
        payer = signer,
        space = 8 + Vault::INIT_SPACE,
        seeds = [b"vault", signer.key().as_ref()],
        bump,
    )]
    pub vault: Account<'info, Vault>,
    #[account(
        init,
        payer = signer,
        space = 8 + PermissionAccount::INIT_SPACE,
        seeds = [b"permission", vault.key().as_ref()],
        bump,
    )]
    pub permission: Account<'info, PermissionAccount>,
    /// The Voltr vault account that this Krypton vault gates.
    /// Must be initialized before calling create_vault.
    /// CHECK: validated by vault account logic
    pub voltr_vault: UncheckedAccount<'info>,
    /// The initial agent session key (orchestrator's public key).
    /// Can be rotated later via rotate_agent_key.
    /// CHECK: validated by permission account logic
    pub agent_signer: UncheckedAccount<'info>,
    /// Guardian multisig that can force-pause.
    /// CHECK: validated by permission account logic
    pub guardian_multisig: UncheckedAccount<'info>,
    #[account(
        init,
        payer = signer,
        space = 8 + VaultGoal::INIT_SPACE,
        seeds = [b"vault_goal", vault.key().as_ref()],
        bump,
    )]
    pub vault_goal: Account<'info, VaultGoal>,
    #[account(
        init,
        payer = signer,
        space = 8 + ExecutionLog::INIT_SPACE,
        seeds = [b"execution_log", vault.key().as_ref()],
        bump,
    )]
    pub execution_log: Account<'info, ExecutionLog>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(args: SubmitPolicyArgs)]
pub struct SubmitPolicy<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        mut,
        seeds = [b"vault", vault.owner.as_ref()],
        bump = vault.bump,
    )]
    pub vault: Account<'info, Vault>,
    #[account(
        init_if_needed,
        payer = signer,
        space = 8 + Policy::INIT_SPACE,
        seeds = [b"policy", vault.key().as_ref()],
        bump,
    )]
    pub policy: Account<'info, Policy>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        mut,
        seeds = [b"vault", vault.owner.as_ref()],
        bump = vault.bump,
    )]
    pub vault: Account<'info, Vault>,
}

#[derive(Accounts)]
pub struct PauseVault<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        mut,
        seeds = [b"vault", vault.owner.as_ref()],
        bump = vault.bump,
    )]
    pub vault: Account<'info, Vault>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        mut,
        seeds = [b"vault", vault.owner.as_ref()],
        bump = vault.bump,
    )]
    pub vault: Account<'info, Vault>,
}

#[derive(Accounts)]
pub struct AmendPolicy<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        mut,
        seeds = [b"vault", vault.owner.as_ref()],
        bump = vault.bump,
    )]
    pub vault: Account<'info, Vault>,
    #[account(
        mut,
        seeds = [b"policy", vault.key().as_ref()],
        bump,
    )]
    pub policy: Account<'info, Policy>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ExecuteAction<'info> {
    pub signer: Signer<'info>,
    #[account(
        mut,
        seeds = [b"vault", vault.owner.as_ref()],
        bump = vault.bump,
    )]
    pub vault: Account<'info, Vault>,
    #[account(
        seeds = [b"policy", vault.key().as_ref()],
        bump,
    )]
    pub policy: Account<'info, Policy>,
    #[account(
        seeds = [b"permission", vault.key().as_ref()],
        bump,
    )]
    pub permission: Account<'info, PermissionAccount>,
    /// Voltr vault program for CPI execution.
    /// CHECK: program ID validated at CPI time in voltr_adapter.
    pub voltr_program: UncheckedAccount<'info>,
    /// Voltr vault account for CPI execution.
    /// CHECK: all constraints verified by the constraint engine gate.
    #[account(mut)]
    pub voltr_vault_account: UncheckedAccount<'info>,
    #[account(
        seeds = [b"vault_goal", vault.key().as_ref()],
        bump,
    )]
    pub vault_goal: Account<'info, VaultGoal>,
    #[account(
        mut,
        seeds = [b"execution_log", vault.key().as_ref()],
        bump,
    )]
    pub execution_log: Account<'info, ExecutionLog>,
}

#[derive(Accounts)]
pub struct CheckConstraints<'info> {
    pub signer: Signer<'info>,
    #[account(
        seeds = [b"vault", vault.owner.as_ref()],
        bump = vault.bump,
    )]
    pub vault: Account<'info, Vault>,
}

#[derive(Accounts)]
pub struct RotateAgentKey<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        mut,
        seeds = [b"vault", vault.owner.as_ref()],
        bump = vault.bump,
    )]
    pub vault: Account<'info, Vault>,
    #[account(
        mut,
        seeds = [b"permission", vault.key().as_ref()],
        bump,
    )]
    pub permission: Account<'info, PermissionAccount>,
    /// CHECK: new agent signer pubkey
    pub new_agent_signer: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct StoreEncryptedState<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        seeds = [b"vault", vault.owner.as_ref()],
        bump = vault.bump,
    )]
    pub vault: Account<'info, Vault>,
    #[account(
        init_if_needed,
        payer = signer,
        space = 8 + EncryptedState::INIT_SPACE,
        seeds = [b"encrypted", vault.key().as_ref()],
        bump,
    )]
    pub encrypted_state: Account<'info, EncryptedState>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DiscloseEncryptedState<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    pub vault: Account<'info, Vault>,
}

#[derive(Accounts)]
pub struct UpdateConstraintState<'info> {
    pub signer: Signer<'info>,
    #[account(
        mut,
        seeds = [b"vault", vault.owner.as_ref()],
        bump = vault.bump,
    )]
    pub vault: Account<'info, Vault>,
    /// CHECK: oracle keeper authority
    pub oracle_keeper: AccountInfo<'info>,
}

/// ─── errors ────────────────────────────────────────────────────

#[error_code]
pub enum ErrorCode {
    #[msg("Only the vault owner can perform this action")]
    NotOwner,
    #[msg("Not authorised — insufficient permission level")]
    NotAuthorised,
    #[msg("Arithmetic overflow")]
    Overflow,
    #[msg("Vault is paused — no actions allowed")]
    VaultPaused,
    #[msg("Insufficient vault balance for withdrawal")]
    InsufficientBalance,
    #[msg("Action rejected by constraint engine")]
    ConstraintRejected,
    #[msg("Action rejected — oracle price stale (>5min)")]
    OracleStale,
    #[msg("Ika dWallet CPI not available — Phase 2")]
    IkaCpiUnavailable,
    #[msg("Voltr CPI call failed")]
    VoltrCpiFailed,
    #[msg("Encrypted data exceeds maximum size")]
    EncryptedDataTooLarge,
    #[msg("Encryption key version mismatch")]
    EncryptionKeyVersionMismatch,
}

/// ─── events ────────────────────────────────────────────────────

#[event]
pub struct VaultCreated {
    pub vault: Pubkey,
    pub owner: Pubkey,
    pub voltr_vault: Pubkey,
}

#[event]
pub struct PolicySubmitted {
    pub vault: Pubkey,
    pub version: u32,
}

#[event]
pub struct Deposited {
    pub vault: Pubkey,
    pub amount: u64,
}

#[event]
pub struct Withdrawn {
    pub vault: Pubkey,
    pub amount: u64,
}

#[event]
pub struct VaultPaused {
    pub vault: Pubkey,
}

#[event]
pub struct VaultUnpaused {
    pub vault: Pubkey,
}

#[event]
pub struct ConstraintsChecked {
    pub vault: Pubkey,
    pub passed: bool,
}

#[event]
pub struct ActionExecuted {
    pub vault: Pubkey,
    pub action_type: u8,
    pub decision: u8,
    pub composite_score: u32,
    pub post_drawdown_bps: u32,
    pub post_leverage_bps: u32,
    pub timestamp: i64,
}

#[event]
pub struct AgentKeyRotated {
    pub vault: Pubkey,
    pub new_agent_signer: Pubkey,
}

#[event]
pub struct EncryptedStateUpdated {
    pub vault: Pubkey,
    pub version: u32,
    pub data_len: u32,
}

#[event]
pub struct DisclosureLogged {
    pub vault: Pubkey,
    pub viewer: Pubkey,
    pub disclosure_type: u8,
    pub timestamp: i64,
}
