import { f as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { U as require_jsx_runtime } from "../_libs/@dynamic-labs/sdk-react-core+[...].mjs";
import { r as PipelineStrip } from "./src-EN_WpEqz.mjs";
import { r as PageShell } from "../__root-BuMiPQ8f.mjs";
import { r as isPrivateBetaActive } from "./invite-CHUafwxM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Bf2BI_NY.js
var import_jsx_runtime = require_jsx_runtime();
var INTEGRATIONS = [
	{
		name: "Jupiter",
		tag: "Swap"
	},
	{
		name: "Kamino",
		tag: "Lend"
	},
	{
		name: "Sanctum",
		tag: "Stake"
	},
	{
		name: "Drift",
		tag: "Perps"
	},
	{
		name: "Pyth",
		tag: "Oracle"
	},
	{
		name: "Ika",
		tag: "MPC"
	}
];
var STEPS = [
	{
		num: "01",
		title: "Define your Capital Policy",
		desc: "Objectives, risk envelope, execution mandate — signed once. Constraints enforced on-chain, not a black box.",
		tag: "policy"
	},
	{
		num: "02",
		title: "Agent pipeline proposes actions",
		desc: "Multi-agent system researches, strategies, and simulates every decision. Level 1 review or Level 2 auto-approve within bounds.",
		tag: "agents"
	},
	{
		num: "03",
		title: "Constraint Engine gates execution",
		desc: "Leverage caps, concentration limits, drawdown stops — hard coded, not promised. Runs 24/7, no babysitting.",
		tag: "engine"
	}
];
var DIFF_ROWS = [
	[
		"Strategy",
		"Fixed or opaque",
		"Ephemeral, regenerated each cycle"
	],
	[
		"Execution",
		"Agent-held keys",
		"Policy-gated MPC (Ika dWallet)"
	],
	[
		"Enforcement",
		"Model judgment",
		"On-chain Constraint Engine"
	],
	[
		"Auditability",
		"Trust the operator",
		"Every cycle hashed and logged"
	],
	[
		"Ops",
		"9-5 oversight",
		"24/7 autonomous within bounds"
	]
];
var STATS = [
	{
		value: "8",
		label: "Constraint checks per action"
	},
	{
		value: "0",
		label: "Agent-held private keys"
	},
	{
		value: "100%",
		label: "On-chain audit trail"
	}
];
function LandingPage() {
	const betaActive = isPrivateBetaActive();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative overflow-hidden px-6 pb-24 pt-20 md:pb-32 md:pt-28",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--accent-primary)_0%,_transparent_30%)] opacity-[0.08]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--accent-secondary)_0%,_transparent_35%)] opacity-[0.06]" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto max-w-6xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-2 rounded-full border border-[var(--accent-primary-glow)] bg-[var(--accent-primary)]/5 px-4 py-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-[var(--accent-secondary)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[11px] uppercase tracking-wider text-[var(--accent-secondary)]",
								children: "Private beta — devnet"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "font-display mt-8 max-w-5xl text-5xl font-bold leading-tight tracking-tight md:text-7xl",
							children: [
								"Create your own",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "gradient-text",
									children: "hedge fund"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 max-w-2xl text-lg leading-relaxed text-[var(--text-secondary)] md:text-xl",
							children: "Define a Capital Policy — objectives, risk envelope, execution mandate. An AI agent pipeline researches strategies, simulates outcomes, and proposes actions. The on-chain Constraint Engine enforces every trade."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 max-w-2xl text-sm text-[var(--text-muted)]",
							children: "Fund infrastructure, not a fund manager. Your vault runs 24/7 within the bounds you set. No seed phrases, no black box, no babysitting."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-10 flex flex-wrap gap-4",
							children: [betaActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/app",
								className: "btn-primary text-sm",
								children: "Launch app →"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/app/create",
								className: "btn-primary text-sm",
								children: "Request private beta"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/docs",
								className: "btn-secondary text-sm",
								children: "Read the schema"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-16",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PipelineStrip, {})
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-y border-[var(--border)] bg-[var(--bg-panel)]/60 py-12",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto grid max-w-6xl grid-cols-3 gap-4 px-6",
				children: STATS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-3xl font-bold gradient-text md:text-4xl",
						children: s.value
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)]",
						children: s.label
					})]
				}, s.label))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-6xl px-6 py-24",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs uppercase tracking-wider text-[var(--accent-primary)]",
						children: "flow: how_it_works"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display mt-3 text-3xl font-semibold",
						children: "From policy to execution"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-[var(--text-secondary)]",
						children: "Three layers define the system. You set the rules, agents propose, engines enforce."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12 grid gap-6 md:grid-cols-3",
				children: STEPS.map((step) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel p-6 transition-all hover:border-[var(--accent-primary)]/30 hover:shadow-lg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-panel-raised)] font-mono text-sm font-bold text-[var(--accent-primary)]",
								children: step.num
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded bg-[var(--accent-primary)]/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[var(--accent-primary)]",
								children: step.tag
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display mt-4 text-lg font-semibold",
							children: step.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-[var(--text-secondary)]",
							children: step.desc
						})
					]
				}, step.num))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-t border-[var(--border)] bg-[var(--bg-panel)]/40 px-6 py-24",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto max-w-6xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-12 md:grid-cols-2 md:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs uppercase tracking-wider text-[var(--accent-secondary)]",
							children: "operations: 24/7_autonomous"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display mt-3 text-3xl font-semibold",
							children: "Your vault never sleeps"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm leading-relaxed text-[var(--text-secondary)]",
							children: "Every vault gets a dedicated agent that manages multiple scoped addresses. Each address has a specific role — swap, lend, stake, oracle, fee — and executes within its bounds autonomously."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-6 space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-3 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--accent-secondary)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[var(--text-secondary)]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-[var(--text-primary)]",
											children: "Agent pipeline"
										}), " — Research, strategy, simulation, and execution agents coordinate autonomously"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-3 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--accent-secondary)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[var(--text-secondary)]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-[var(--text-primary)]",
											children: "Role-scoped wallets"
										}), " — Each agent action uses a deterministic PDA for its purpose, auditable and verifiable"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-3 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-1 h-2 w-2 shrink-0 rounded-full bg-[var(--accent-secondary)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[var(--text-secondary)]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-[var(--text-primary)]",
											children: "Constraint Engine"
										}), " — Leverage, concentration, and drawdown limits enforced on-chain before any execution"]
									})]
								})
							]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "panel-raised p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]",
							children: "agent_architecture"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-[var(--border)] bg-[var(--bg-panel)] p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono text-xs text-[var(--accent-primary)]",
										children: "Research Agent"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-[var(--text-secondary)]",
										children: "Market analysis, opportunity scanning, risk assessment"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-[var(--border)] bg-[var(--bg-panel)] p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono text-xs text-[var(--accent-primary)]",
										children: "Strategy Agent"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-[var(--text-secondary)]",
										children: "Position sizing, portfolio rebalancing, execution routing"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-[var(--border)] bg-[var(--bg-panel)] p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono text-xs text-[var(--accent-primary)]",
										children: "Simulation Agent"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-[var(--text-secondary)]",
										children: "Monte Carlo simulation, backtesting, scenario analysis"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-[var(--accent-primary)]/30 bg-[var(--accent-primary)]/5 p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono text-xs text-[var(--accent-secondary)]",
										children: "Execution Agent"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-[var(--text-secondary)]",
										children: "Submits to Constraint Engine → Ika dWallet signing → settles on-chain. Full audit trail, every cycle hashed."
									})]
								})
							]
						})]
					})]
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-6xl px-6 py-24",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs uppercase tracking-wider text-[var(--accent-primary)]",
				children: "constraints: vs_alternatives"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 overflow-x-auto rounded-2xl border border-[var(--border)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[640px] border-collapse text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-[var(--border)] bg-[var(--bg-panel-raised)] font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-4",
								children: "Dimension"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-4",
								children: "Typical AI vault"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-5 py-4",
								children: "Krypton"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: DIFF_ROWS.map(([dim, typical, krypton]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-[var(--border)]/60 last:border-b-0 transition-colors hover:bg-[var(--bg-panel)]/50",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-4 font-medium",
								children: dim
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-4 text-[var(--text-secondary)]",
								children: typical
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-5 py-4 text-[var(--accent-secondary)]",
								children: krypton
							})
						]
					}, dim)) })]
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-t border-[var(--border)] bg-[var(--bg-panel)]/40 px-6 py-24",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-6xl text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs uppercase tracking-wider text-[var(--accent-primary)]",
						children: "integrations: ecosystem"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display mt-3 text-3xl font-semibold",
						children: "Built on Solana"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-6",
						children: INTEGRATIONS.map(({ name, tag }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "panel flex items-center justify-between gap-2 px-4 py-3 transition-all hover:border-[var(--accent-primary)]/30 sm:flex-col sm:items-start sm:gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-sm font-semibold",
								children: name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded bg-[var(--accent-primary)]/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[var(--accent-primary)]",
								children: tag
							})]
						}, name))
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "px-6 py-24 text-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs uppercase tracking-[0.2em] text-[var(--accent-primary)]",
						children: "ready: deploy"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "font-display mt-4 text-3xl font-semibold md:text-4xl",
						children: [
							"Verify the policy.",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"Not the strategy."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-[var(--text-secondary)]",
						children: "Your vault enforces a signed Capital Policy. No manager risk. No black box."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-10 flex flex-wrap justify-center gap-4",
						children: betaActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/app",
							className: "btn-primary text-sm",
							children: "Launch app →"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/app/create",
							className: "btn-primary text-sm",
							children: "Request private beta"
						})
					})
				]
			})
		})
	] });
}
//#endregion
export { LandingPage as component };
