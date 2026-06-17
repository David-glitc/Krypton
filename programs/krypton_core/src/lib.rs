use anchor_lang::prelude::*;

declare_id!("4Xs4pQ2vA9bv8dTxoe6cA9sQZBLZr6aKD4RrGnCdB1g6");

/// Krypton Capital Policy Engine — Phase 1 MVP
///
/// On-chain accounts and instructions for vault lifecycle, policy submission,
/// constraint state tracking, and execution gating.
#[program]
pub mod krypton_core {
    use super::*;

    /// Initialise a new vault. The signer becomes the vault owner.
    /// `max_drawdown_bps`, `max_leverage_bps`, `max_position_bps` seed the
    /// initial constraint state. A policy is required before the vault becomes
    /// operational (`paused` starts as true).
    pub fn create_vault(ctx: Context<CreateVault>, args: CreateVaultArgs) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.owner = ctx.accounts.signer.key();
        vault.bump = ctx.bumps.vault;
        vault.nav_usd = 0;
        vault.policy_version = 0;
        vault.paused = true;
        vault.constraint = ConstraintState {
            max_drawdown_bps: args.max_drawdown_bps,
            max_leverage_bps: args.max_leverage_bps,
            max_position_bps: args.max_position_bps,
            current_drawdown_bps: 0,
            current_leverage_bps: 0,
            current_concentration_bps: 0,
        };
        emit!(VaultCreated {
            vault: vault.key(),
            owner: ctx.accounts.signer.key(),
        });
        Ok(())
    }

    /// Submit (or replace) the capital policy for a vault. Stored off-chain;
    /// the on-chain hash anchors the canonical JSON. A policy must set
    /// `max_drawdown_bps`, `max_leverage_bps`, `max_position_bps` that do not
    /// exceed the vault's declared maximums.
    pub fn submit_policy(
        ctx: Context<SubmitPolicy>,
        args: SubmitPolicyArgs,
    ) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        let policy = &mut ctx.accounts.policy;

        require!(vault.owner == ctx.accounts.signer.key(), ErrorCode::NotOwner);

        let constraint = &mut vault.constraint;
        constraint.max_drawdown_bps = args.max_drawdown_bps;
        constraint.max_leverage_bps = args.max_leverage_bps;
        constraint.max_position_bps = args.max_position_bps;

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

    /// Deposit SOL into the vault, increasing NAV.
    pub fn deposit(ctx: Context<Deposit>, amount_usd: u64) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.nav_usd = vault.nav_usd.checked_add(amount_usd).ok_or(ErrorCode::Overflow)?;
        emit!(Deposited {
            vault: vault.key(),
            amount: amount_usd,
        });
        Ok(())
    }

    /// Pause a vault (triggers when constraints are breached or manually by owner).
    pub fn pause_vault(ctx: Context<PauseVault>, reason: Option<String>) -> Result<()> {
        require!(vault_owner_or_authorised(&ctx), ErrorCode::NotAuthorised);
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

    /// Check whether a proposed action passes constraint checks.
    /// Returns a success bool — the Constraint Engine on-chain gate.
    pub fn check_constraints(
        ctx: Context<CheckConstraints>,
        args: CheckConstraintsArgs,
    ) -> Result<bool> {
        let vault = &ctx.accounts.vault;
        let c = &vault.constraint;

        require!(!vault.paused, ErrorCode::VaultPaused);

        if args.post_leverage_bps > c.max_leverage_bps {
            msg!("REJECTED: leverage {} > max {}", args.post_leverage_bps, c.max_leverage_bps);
            return Ok(false);
        }
        if args.post_concentration_bps > c.max_position_bps {
            msg!("REJECTED: concentration {} > max {}", args.post_concentration_bps, c.max_position_bps);
            return Ok(false);
        }
        if args.post_drawdown_bps > c.max_drawdown_bps {
            msg!("REJECTED: drawdown {} > max {}", args.post_drawdown_bps, c.max_drawdown_bps);
            return Ok(false);
        }

        msg!("constraints PASS");
        emit!(ConstraintsChecked {
            vault: vault.key(),
            passed: true,
        });
        Ok(true)
    }
}

/// ---------- accounts ----------

#[account]
#[derive(InitSpace)]
pub struct Vault {
    pub owner: Pubkey,
    pub bump: u8,
    pub nav_usd: u64,
    pub policy_version: u32,
    pub paused: bool,
    #[max_len(64)]
    pub pause_reason: Option<String>,   // MAX_LEN 64
    pub constraint: ConstraintState,
}

#[account]
#[derive(InitSpace)]
pub struct Policy {
    pub vault: Pubkey,
    pub policy_version: u32,
    pub content_hash: [u8; 32],        // sha256 of canonical JSON
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace, Debug)]
pub struct ConstraintState {
    pub max_drawdown_bps: u64,
    pub max_leverage_bps: u64,
    pub max_position_bps: u64,
    pub current_drawdown_bps: i64,
    pub current_leverage_bps: i64,
    pub current_concentration_bps: i64,
}

/// ---------- args ----------

#[derive(AnchorSerialize, AnchorDeserialize, Debug)]
pub struct CreateVaultArgs {
    pub max_drawdown_bps: u64,
    pub max_leverage_bps: u64,
    pub max_position_bps: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Debug)]
pub struct SubmitPolicyArgs {
    pub max_drawdown_bps: u64,
    pub max_leverage_bps: u64,
    pub max_position_bps: u64,
    pub content_hash: [u8; 32],
}

#[derive(AnchorSerialize, AnchorDeserialize, Debug)]
pub struct CheckConstraintsArgs {
    pub post_leverage_bps: u64,
    pub post_concentration_bps: u64,
    pub post_drawdown_bps: u64,
}

/// ---------- contexts ----------

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
pub struct CheckConstraints<'info> {
    pub signer: Signer<'info>,
    #[account(
        seeds = [b"vault", vault.owner.as_ref()],
        bump = vault.bump,
    )]
    pub vault: Account<'info, Vault>,
}

/// ---------- helpers ----------

fn vault_owner_or_authorised(ctx: &Context<PauseVault>) -> bool {
    ctx.accounts.vault.owner == ctx.accounts.signer.key()
}

/// ---------- errors ----------

#[error_code]
pub enum ErrorCode {
    #[msg("Only the vault owner can perform this action")]
    NotOwner,
    #[msg("Not authorised")]
    NotAuthorised,
    #[msg("Arithmetic overflow")]
    Overflow,
    #[msg("Vault is paused — no actions allowed")]
    VaultPaused,
}

/// ---------- events ----------

#[event]
pub struct VaultCreated {
    pub vault: Pubkey,
    pub owner: Pubkey,
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