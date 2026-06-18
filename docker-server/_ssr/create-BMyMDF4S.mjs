import { s as __toESM } from "../_runtime.mjs";
import { I as require_react } from "../_libs/dynamic-labs__iconic+react.mjs";
import { f as Link, p as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { U as require_jsx_runtime } from "../_libs/@dynamic-labs/sdk-react-core+[...].mjs";
import { i as PolicyBlock } from "./src-EN_WpEqz.mjs";
import { a as number, i as literal, n as _enum, o as object, r as array, s as string, t as number$1 } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/create-BMyMDF4S.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var RISK_PROFILES = [
	"low",
	"medium",
	"high",
	"custom"
];
var EXECUTION_MODES = [
	"advisory",
	"constrained_auto",
	"full_auto"
];
var GOVERNANCE_MODES = ["owner", "dao_prediction_market"];
var PRIVACY_LEVELS = ["standard", "full"];
var REBALANCE_FREQUENCIES = [
	"event_driven",
	"hourly",
	"daily",
	"weekly"
];
var ALLOWED_ACTIONS = [
	"swap",
	"stake",
	"lend",
	"borrow",
	"provide_liquidity"
];
var DEFAULT_ASSETS = [
	"SOL",
	"ETH",
	"BTC",
	"USDC",
	"USDT"
];
var DEFAULT_PROTOCOLS = [
	"jupiter",
	"drift",
	"kamino",
	"sanctum",
	"marginfi"
];
object({
	policy_version: literal(1),
	objective: object({
		type: _enum(["maximize_risk_adjusted_return"]),
		benchmark: string().optional()
	}),
	universe: object({
		assets: array(string()).min(1),
		protocols_allowed: array(string()).min(1)
	}),
	risk: object({
		profile: _enum(RISK_PROFILES),
		max_drawdown_pct: number().min(1).max(50),
		max_leverage: number().min(1).max(2),
		max_position_pct: number().min(5).max(100),
		max_correlated_exposure_pct: number().min(10).max(100)
	}),
	liquidity: object({ min_pool_liquidity_usd: number().min(0) }),
	time_horizon_days: number().min(7).max(365),
	allowed_actions: array(_enum(ALLOWED_ACTIONS)).min(1),
	forbidden: array(string()).default([]),
	execution: object({
		mode: _enum(EXECUTION_MODES),
		rebalance_frequency: _enum(REBALANCE_FREQUENCIES)
	}),
	governance: object({ mode: _enum(GOVERNANCE_MODES) }),
	privacy: object({
		level: _enum(PRIVACY_LEVELS),
		disclose: array(string()).default([])
	}),
	fees: object({
		management_bps: number().min(0).max(500),
		performance_bps: number().min(0).max(5e3),
		hurdle_rate_pct: number().min(0).max(100)
	}).default({
		management_bps: 0,
		performance_bps: 1e3,
		hurdle_rate_pct: 0
	}),
	emergency: object({
		pause_authority: array(string()).default(["owner_wallet"]),
		auto_pause_on: array(string()).default([])
	}).default({
		pause_authority: ["owner_wallet"],
		auto_pause_on: []
	})
});
var policyBuilderFormSchema = object({
	vaultName: string().min(2).max(48),
	governanceMode: _enum(GOVERNANCE_MODES),
	riskProfile: _enum(RISK_PROFILES),
	maxDrawdownPct: number$1().min(1).max(50),
	maxLeverage: number$1().min(1).max(2),
	maxPositionPct: number$1().min(5).max(100),
	assets: array(string()).min(1),
	protocols: array(string()).min(1),
	executionMode: _enum(EXECUTION_MODES),
	rebalanceFrequency: _enum(REBALANCE_FREQUENCIES),
	permissionLevel: number$1().min(1).max(4).default(2)
});
function formToCapitalPolicy(form) {
	return {
		policy_version: 1,
		objective: {
			type: "maximize_risk_adjusted_return",
			benchmark: "SOL_USD"
		},
		universe: {
			assets: form.assets,
			protocols_allowed: form.protocols
		},
		risk: {
			profile: form.riskProfile,
			max_drawdown_pct: form.maxDrawdownPct,
			max_leverage: form.maxLeverage,
			max_position_pct: form.maxPositionPct,
			max_correlated_exposure_pct: 60
		},
		liquidity: { min_pool_liquidity_usd: 5e6 },
		time_horizon_days: 90,
		allowed_actions: [
			"swap",
			"stake",
			"lend"
		],
		forbidden: [
			"leverage_above_policy_max",
			"unverified_protocols",
			"memecoins"
		],
		execution: {
			mode: form.executionMode,
			rebalance_frequency: form.rebalanceFrequency
		},
		governance: { mode: form.governanceMode },
		privacy: {
			level: "standard",
			disclose: [
				"proof_of_reserves",
				"proof_of_performance",
				"fee_accrual",
				"vault_nav"
			]
		},
		fees: {
			management_bps: 0,
			performance_bps: 1e3,
			hurdle_rate_pct: 0
		},
		emergency: {
			pause_authority: ["owner_wallet", "protocol_guardian_multisig"],
			auto_pause_on: ["drawdown_exceeds_max", "oracle_staleness_seconds_gt_120"]
		}
	};
}
var defaultPolicyBuilderForm = {
	vaultName: "",
	governanceMode: "owner",
	riskProfile: "medium",
	maxDrawdownPct: 12,
	maxLeverage: 2,
	maxPositionPct: 35,
	assets: [
		"SOL",
		"USDC",
		"USDT"
	],
	protocols: [
		"jupiter",
		"kamino",
		"sanctum"
	],
	executionMode: "advisory",
	rebalanceFrequency: "daily",
	permissionLevel: 2
};
object({
	vault: string().optional(),
	target_type: _enum([
		"multiple",
		"apy",
		"preservation",
		"fixed_use_case"
	]),
	target_value: number().positive().optional(),
	time_horizon_days: number().min(7).max(365),
	use_case: _enum([
		"compound",
		"save",
		"collateral",
		"onchain_deposit_box",
		"speculative_growth"
	]).optional(),
	created_from_prompt_hash: string().optional()
});
var HISTORICAL_DRAWDOWN_BANDS = {
	low: {
		min: 1,
		max: 5
	},
	"low-medium": {
		min: 5,
		max: 10
	},
	medium: {
		min: 10,
		max: 20
	},
	high: {
		min: 20,
		max: 40
	},
	extreme: {
		min: 30,
		max: 60
	}
};
var AGGRESSIVE_THRESHOLD_BPS = 2500;
function assessFeasibility(targetType, targetValue, drawdownLimitPct, timeHorizonDays) {
	const band = HISTORICAL_DRAWDOWN_BANDS[determineRequiredBand(targetType, targetValue, timeHorizonDays)];
	if (!band) return {
		status: "feasible",
		reference_band: {
			min_historical_drawdown_pct: 0,
			max_historical_drawdown_pct: 50
		}
	};
	if (!(drawdownLimitPct >= band.min)) return {
		status: "infeasible",
		reference_band: {
			min_historical_drawdown_pct: band.min,
			max_historical_drawdown_pct: band.max
		},
		negotiation_prompt: `A ${targetValue}x target in ${timeHorizonDays} days historically requires strategies with ${band.min}-${band.max}%+ drawdown risk. Your ${drawdownLimitPct}% drawdown limit and this target are not jointly achievable. Consider raising drawdown tolerance, extending horizon, or advisory-only mode.`
	};
	return {
		status: "feasible",
		reference_band: {
			min_historical_drawdown_pct: band.min,
			max_historical_drawdown_pct: band.max
		}
	};
}
function determineRequiredBand(targetType, targetValue, timeHorizonDays) {
	if (targetType === "preservation" || targetType === "fixed_use_case") return "low";
	if (targetType === "apy") {
		const impliedMultiple = 1 + targetValue / 100 * (timeHorizonDays / 365);
		if (impliedMultiple < 1.1) return "low";
		if (impliedMultiple < 1.3) return "low-medium";
		return "medium";
	}
	const annualizedFactor = targetValue ** (365 / Math.max(timeHorizonDays, 1));
	if (annualizedFactor < 1.5) return "low";
	if (annualizedFactor < 3) return "low-medium";
	if (annualizedFactor < 6) return "medium";
	if (annualizedFactor < 15) return "high";
	return "extreme";
}
var PRESET_FUND_MANAGERS = [
	{
		id: "stable-saver",
		name: "Stable Saver",
		description: "Preservation-focused. Lend USDC/USDT across lending protocols. No swaps, no leverage.",
		targetType: "preservation",
		riskProfile: "low",
		executionMode: "constrained_auto",
		assets: ["USDC", "USDT"],
		protocols: ["kamino", "marginfi"],
		maxDrawdownPct: 2,
		maxLeverage: 1,
		maxPositionPct: 50,
		hardLockAdvisory: false
	},
	{
		id: "steady-compounder",
		name: "Steady Compounder",
		description: "LST yield + lending blend for sustainable ~6-10% APY.",
		targetType: "apy",
		riskProfile: "low-medium",
		executionMode: "constrained_auto",
		assets: [
			"SOL",
			"USDC",
			"USDT"
		],
		protocols: ["sanctum", "kamino"],
		maxDrawdownPct: 8,
		maxLeverage: 1,
		maxPositionPct: 40,
		hardLockAdvisory: false
	},
	{
		id: "growth-allocator",
		name: "Growth Allocator",
		description: "Multi-asset growth with advisory → auto progression after track record.",
		targetType: "multiple",
		riskProfile: "medium",
		executionMode: "constrained_auto",
		assets: [
			"SOL",
			"ETH",
			"BTC",
			"USDC"
		],
		protocols: [
			"jupiter",
			"kamino",
			"sanctum"
		],
		maxDrawdownPct: 15,
		maxLeverage: 1.5,
		maxPositionPct: 35,
		hardLockAdvisory: false
	},
	{
		id: "aggressive-compounder",
		name: "Aggressive Compounder",
		description: "High-variance leveraged strategies. HARD-LOCKED to advisory mode regardless of permission level.",
		targetType: "multiple",
		riskProfile: "high",
		executionMode: "advisory",
		assets: [
			"SOL",
			"ETH",
			"BTC",
			"USDC"
		],
		protocols: ["jupiter", "drift"],
		maxDrawdownPct: 30,
		maxLeverage: 2,
		maxPositionPct: 50,
		hardLockAdvisory: true
	},
	{
		id: "collateral-vault",
		name: "Collateral Vault",
		description: "Hold a single asset as collateral for external borrowing. No strategy pipeline.",
		targetType: "fixed_use_case",
		riskProfile: "low",
		executionMode: "constrained_auto",
		assets: ["SOL", "USDC"],
		protocols: [],
		maxDrawdownPct: 5,
		maxLeverage: 1,
		maxPositionPct: 100,
		hardLockAdvisory: false
	},
	{
		id: "onchain-deposit-box",
		name: "On-Chain Deposit Box",
		description: "Degenerate case — deposit and hold. No agent pipeline runs.",
		targetType: "fixed_use_case",
		riskProfile: "low",
		executionMode: "constrained_auto",
		assets: [],
		protocols: [],
		maxDrawdownPct: 100,
		maxLeverage: 1,
		maxPositionPct: 100,
		hardLockAdvisory: false
	}
];
var STEPS = [
	"Start",
	"Risk",
	"Universe",
	"Review"
];
function CreateVaultPage() {
	const navigate = useNavigate();
	const [step, setStep] = (0, import_react.useState)(0);
	const [form, setForm] = (0, import_react.useState)(defaultPolicyBuilderForm);
	const [errors, setErrors] = (0, import_react.useState)([]);
	const [prompt, setPrompt] = (0, import_react.useState)("");
	const [selectedPreset, setSelectedPreset] = (0, import_react.useState)(null);
	const feasibility = (0, import_react.useMemo)(() => {
		if (form.maxDrawdownPct <= 0) return null;
		return assessFeasibility(form.riskProfile === "high" ? "multiple" : form.riskProfile === "low" ? "preservation" : "apy", form.riskProfile === "high" ? 3 : form.riskProfile === "low" ? 1 : 8, form.maxDrawdownPct, 90);
	}, [form.maxDrawdownPct, form.riskProfile]);
	const isAggressiveLocked = form.maxDrawdownPct * 100 >= AGGRESSIVE_THRESHOLD_BPS;
	function update(key, value) {
		setForm((f) => ({
			...f,
			[key]: value
		}));
	}
	function toggleInList(key, item) {
		setForm((f) => {
			const list = f[key];
			return {
				...f,
				[key]: list.includes(item) ? list.filter((x) => x !== item) : [...list, item]
			};
		});
	}
	function applyPreset(presetId) {
		const preset = PRESET_FUND_MANAGERS.find((p) => p.id === presetId);
		if (!preset) return;
		setSelectedPreset(presetId);
		setForm((f) => ({
			...f,
			vaultName: f.vaultName || preset.id.replace(/-/g, "_"),
			riskProfile: preset.riskProfile,
			maxDrawdownPct: preset.maxDrawdownPct,
			maxLeverage: preset.maxLeverage,
			maxPositionPct: preset.maxPositionPct,
			assets: preset.assets,
			protocols: preset.protocols,
			executionMode: preset.executionMode
		}));
		setStep(1);
	}
	function handlePromptSubmit() {
		const p = prompt.toLowerCase();
		if (p.includes("save") || p.includes("usdc") || p.includes("stable") || p.includes("lend")) applyPreset("stable-saver");
		else if (p.includes("compound") || p.includes("long term") || p.includes("grow") || p.includes("yield")) applyPreset("steady-compounder");
		else if (p.includes("5x") || p.includes("aggressive") || p.includes("high risk") || p.includes("perps")) applyPreset("aggressive-compounder");
		else if (p.includes("collateral") || p.includes("hold") || p.includes("deposit box")) applyPreset("collateral-vault");
		else if (p.includes("2x") || p.includes("3x") || p.includes("growth")) applyPreset("growth-allocator");
		else {
			const drawdownMatch = p.match(/(\d+)%?\s*(?:drawdown|down|loss|stop)/i);
			const leverageMatch = p.match(/(\d+(?:\.\d+)?)x?\s*(?:leverage|lev)/i);
			if (drawdownMatch) update("maxDrawdownPct", Math.min(50, Math.max(1, Number(drawdownMatch[1]))));
			if (leverageMatch) update("maxLeverage", Math.min(2, Math.max(1, Number(leverageMatch[1]))));
			setStep(1);
		}
	}
	function next() {
		setErrors([]);
		if (step === 0 && !form.vaultName.trim() && !selectedPreset) {
			setErrors(["Enter a vault name or select a preset"]);
			return;
		}
		if (step < STEPS.length - 1) setStep((s) => s + 1);
	}
	function back() {
		setErrors([]);
		if (step > 0) setStep((s) => s - 1);
	}
	function submit() {
		const parsed = policyBuilderFormSchema.safeParse(form);
		if (!parsed.success) {
			setErrors(parsed.error.issues.map((i) => i.message));
			return;
		}
		const policy = formToCapitalPolicy(parsed.data);
		console.info("Policy ready for on-chain submit_policy", policy);
		navigate({
			to: "/app/vault/$id",
			params: { id: "vault-alpha" }
		});
	}
	const previewPolicy = formToCapitalPolicy(form);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-6 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs uppercase tracking-wider text-[var(--accent-policy)]",
				children: "policy: builder_wizard"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display mt-2 text-3xl font-semibold",
				children: "Create vault"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 flex gap-2",
				children: STEPS.map((label, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: i === step ? "font-mono text-xs uppercase tracking-wider text-[var(--accent-policy)]" : "font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)]",
					children: [label, i < STEPS.length - 1 && " · "]
				}, label))
			}),
			errors.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 rounded border border-[var(--accent-risk)]/50 bg-[var(--accent-risk)]/10 p-3 text-sm text-[var(--accent-risk)]",
				children: errors.join(" · ")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel mt-8 p-6",
				children: [
					step === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs uppercase text-[var(--text-secondary)]",
									children: "describe_your_goal"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									className: "mt-2 w-full rounded border border-[var(--border)] bg-[var(--bg-base)] px-3 py-2 font-mono text-sm",
									rows: 3,
									value: prompt,
									onChange: (e) => setPrompt(e.target.value),
									placeholder: "e.g. I want 5x in 10 weeks, stop if I'm down 5%. Or: Compound my SOL for the long term."
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handlePromptSubmit,
								className: "btn-secondary mt-3 text-xs",
								children: "Parse prompt →"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-[var(--border)]" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-xs text-[var(--text-muted)]",
										children: "or choose a preset"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-[var(--border)]" })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid gap-3 sm:grid-cols-2",
								children: PRESET_FUND_MANAGERS.map((preset) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => applyPreset(preset.id),
									className: `rounded-xl border p-4 text-left transition-all hover:border-[var(--accent-policy)]/50 ${selectedPreset === preset.id ? "border-[var(--accent-policy)] bg-[var(--accent-policy)]/5" : "border-[var(--border)] bg-[var(--bg-panel)]"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-display text-sm font-semibold",
												children: preset.name
											}), preset.hardLockAdvisory && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded bg-[var(--accent-warning)]/10 px-1.5 py-0.5 font-mono text-[9px] uppercase text-[var(--accent-warning)]",
												children: "advisory only"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-xs text-[var(--text-secondary)]",
											children: preset.description
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-2 flex flex-wrap gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "rounded bg-[var(--bg-panel-raised)] px-1.5 py-0.5 font-mono text-[9px] text-[var(--text-muted)]",
												children: [
													"max ",
													preset.maxDrawdownPct,
													"% drawdown"
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "rounded bg-[var(--bg-panel-raised)] px-1.5 py-0.5 font-mono text-[9px] text-[var(--text-muted)]",
												children: [preset.maxLeverage, "x lev"]
											})]
										})
									]
								}, preset.id))
							})
						]
					}),
					step === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs uppercase text-[var(--text-secondary)]",
									children: "vault_name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									className: "mt-1 w-full rounded border border-[var(--border)] bg-[var(--bg-base)] px-3 py-2 font-mono text-sm",
									value: form.vaultName,
									onChange: (e) => update("vaultName", e.target.value),
									placeholder: "my-policy-vault"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs uppercase text-[var(--text-secondary)]",
									children: "governance_mode"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									className: "mt-1 w-full rounded border border-[var(--border)] bg-[var(--bg-base)] px-3 py-2 font-mono text-sm",
									value: form.governanceMode,
									onChange: (e) => update("governanceMode", e.target.value),
									children: GOVERNANCE_MODES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: m,
										children: m
									}, m))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs uppercase text-[var(--text-secondary)]",
									children: "risk_profile"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									className: "mt-1 w-full rounded border border-[var(--border)] bg-[var(--bg-base)] px-3 py-2 font-mono text-sm",
									value: form.riskProfile,
									onChange: (e) => update("riskProfile", e.target.value),
									children: RISK_PROFILES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: r,
										children: r
									}, r))
								})]
							}),
							[
								[
									"maxDrawdownPct",
									"max_drawdown_pct",
									1,
									50
								],
								[
									"maxLeverage",
									"max_leverage",
									1,
									2
								],
								[
									"maxPositionPct",
									"max_position_pct",
									5,
									100
								]
							].map(([key, label, min, max]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs uppercase text-[var(--text-secondary)]",
									children: label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									min,
									max,
									step: key === "maxLeverage" ? .1 : 1,
									className: "mt-1 w-full rounded border border-[var(--border)] bg-[var(--bg-base)] px-3 py-2 font-mono text-sm",
									value: form[key],
									onChange: (e) => update(key, Number(e.target.value))
								})]
							}, key)),
							feasibility && feasibility.status === "infeasible" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded border border-[var(--accent-warning)]/40 bg-[var(--accent-warning)]/10 p-3 text-sm text-[var(--accent-warning)]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-xs uppercase tracking-wider",
									children: "feasibility_warning"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs",
									children: feasibility.negotiation_prompt
								})]
							}),
							feasibility && feasibility.status === "feasible" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded border border-[var(--accent-secondary)]/30 bg-[var(--accent-secondary)]/5 p-3 text-xs text-[var(--accent-secondary)]",
								children: "✓ Risk envelope is feasible for the selected profile."
							}),
							isAggressiveLocked && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded border border-[var(--accent-warning)]/40 bg-[var(--accent-warning)]/10 p-3 text-sm text-[var(--accent-warning)]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-xs uppercase tracking-wider",
									children: "advisory_lock"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs",
									children: "Drawdown ≥ 25% requires advisory-only mode per safety policy. Execution will require manual approval."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs uppercase text-[var(--text-secondary)]",
									children: "execution_mode"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									className: "mt-1 w-full rounded border border-[var(--border)] bg-[var(--bg-base)] px-3 py-2 font-mono text-sm",
									value: form.executionMode,
									onChange: (e) => update("executionMode", e.target.value),
									children: EXECUTION_MODES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: m,
										children: m
									}, m))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono text-xs uppercase text-[var(--text-secondary)]",
									children: "rebalance_frequency"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									className: "mt-1 w-full rounded border border-[var(--border)] bg-[var(--bg-base)] px-3 py-2 font-mono text-sm",
									value: form.rebalanceFrequency,
									onChange: (e) => update("rebalanceFrequency", e.target.value),
									children: REBALANCE_FREQUENCIES.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: f,
										children: f
									}, f))
								})]
							})
						]
					}),
					step === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-xs uppercase text-[var(--text-secondary)]",
								children: "universe.assets"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 flex flex-wrap gap-2",
								children: DEFAULT_ASSETS.map((asset) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => toggleInList("assets", asset),
									className: form.assets.includes(asset) ? "rounded border border-[var(--accent-policy)] bg-[var(--accent-policy)]/10 px-3 py-1 font-mono text-xs text-[var(--accent-policy)]" : "rounded border border-[var(--border)] px-3 py-1 font-mono text-xs text-[var(--text-secondary)]",
									children: asset
								}, asset))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-xs uppercase text-[var(--text-secondary)]",
								children: "protocols_allowed"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 flex flex-wrap gap-2",
								children: DEFAULT_PROTOCOLS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => toggleInList("protocols", p),
									className: form.protocols.includes(p) ? "rounded border border-[var(--accent-policy)] bg-[var(--accent-policy)]/10 px-3 py-1 font-mono text-xs text-[var(--accent-policy)]" : "rounded border border-[var(--border)] px-3 py-1 font-mono text-xs text-[var(--text-secondary)]",
									children: p
								}, p))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-mono text-xs text-[var(--text-secondary)]",
								children: ["allowed_actions: ", ALLOWED_ACTIONS.join(", ")]
							})
						]
					}),
					step === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PolicyBlock, { fields: {
								vault: form.vaultName || "—",
								governance: form.governanceMode,
								risk_profile: form.riskProfile,
								max_drawdown_pct: `${form.maxDrawdownPct}%`,
								max_leverage: `${form.maxLeverage}x`,
								assets: form.assets.join(", "),
								protocols: form.protocols.join(", "),
								execution: form.executionMode
							} }),
							selectedPreset && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded border border-[var(--accent-policy)]/30 bg-[var(--accent-policy)]/5 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-mono text-xs uppercase tracking-wider text-[var(--accent-policy)]",
									children: ["preset: ", selectedPreset]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-[var(--text-secondary)]",
									children: PRESET_FUND_MANAGERS.find((p) => p.id === selectedPreset)?.description
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
								className: "text-sm text-[var(--text-secondary)]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
									className: "cursor-pointer font-mono text-xs uppercase",
									children: "Canonical JSON"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
									className: "mt-2 overflow-x-auto rounded bg-[var(--bg-base)] p-3 font-mono text-xs",
									children: JSON.stringify(previewPolicy, null, 2)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-[var(--text-secondary)]",
								children: "Signing will call create_vault + submit_policy on devnet once Phase 1 program is deployed."
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: back,
					disabled: step === 0,
					className: "btn-secondary disabled:opacity-40",
					children: "Back"
				}), step < STEPS.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: next,
					className: "btn-primary",
					children: "Continue"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: submit,
					className: "btn-primary",
					children: "Sign & create vault"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-center text-xs text-[var(--text-secondary)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/app",
					children: "Cancel"
				})
			})
		]
	});
}
//#endregion
export { CreateVaultPage as component };
