import { a as getVault, i as constraintToBarInput, r as NAV_HISTORY } from "./mock-data-BoCPJmKJ.mjs";
import { f as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { U as require_jsx_runtime } from "../_libs/@dynamic-labs/sdk-react-core+[...].mjs";
import { i as PolicyBlock, t as ConstraintBars } from "./src-EN_WpEqz.mjs";
import { t as Route } from "./vault._id-BAFY8-lG.mjs";
import { a as ResponsiveContainer, i as Area, n as YAxis, o as Tooltip, r as XAxis, t as AreaChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vault._id-BA2mBDEG.js
var import_jsx_runtime = require_jsx_runtime();
function VaultDashboardPage() {
	const { id } = Route.useParams();
	const vault = getVault(id);
	if (!vault) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-6 py-20 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-[var(--accent-risk)]",
			children: ["Vault not found — ", id]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/app",
			className: "btn-secondary mt-6 inline-flex",
			children: "Back to vaults"
		})]
	});
	const bars = constraintToBarInput(vault.constraint);
	const drawdownUtilization = (vault.constraint.currentDrawdownBps / vault.constraint.maxDrawdownBps * 100).toFixed(0);
	const leverageUtilization = (vault.constraint.currentLeverageBps / vault.constraint.maxLeverageBps * 100).toFixed(0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-6 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl font-semibold",
						children: vault.name
					}), vault.constraint.paused && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded bg-[var(--accent-risk)]/10 px-2 py-0.5 font-mono text-xs uppercase text-[var(--accent-risk)]",
						children: "paused"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex items-center gap-4 text-sm text-[var(--text-secondary)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-mono text-[var(--accent-policy)]",
							children: [
								"$",
								vault.navUsd.toLocaleString(),
								" NAV"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Policy v", vault.policyVersion] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Level ", vault.permissionLevel] })
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/app/vault/$id/activity",
						params: { id },
						className: "btn-secondary text-xs",
						children: "Activity"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/app/vault/$id/policy",
						params: { id },
						className: "btn-secondary text-xs",
						children: "Policy"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConstraintCard, {
						label: "drawdown",
						current: vault.constraint.currentDrawdownBps / 100,
						max: vault.constraint.maxDrawdownBps / 100,
						unit: "%",
						utilization: Number(drawdownUtilization)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConstraintCard, {
						label: "leverage",
						current: vault.constraint.currentLeverageBps / 1e4,
						max: vault.constraint.maxLeverageBps / 1e4,
						unit: "x",
						utilization: Number(leverageUtilization)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConstraintCard, {
						label: "concentration",
						current: vault.constraint.currentPositionConcentrationBps / 100,
						max: vault.constraint.maxPositionBps / 100,
						unit: "%",
						utilization: Number((vault.constraint.currentPositionConcentrationBps / vault.constraint.maxPositionBps * 100).toFixed(0))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)]",
						children: "nav_history"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 h-64",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
								data: NAV_HISTORY,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
										id: "navGradient",
										x1: "0",
										y1: "0",
										x2: "0",
										y2: "1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "5%",
											stopColor: "var(--accent-primary)",
											stopOpacity: .3
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
											offset: "95%",
											stopColor: "var(--accent-primary)",
											stopOpacity: 0
										})]
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "date",
										tick: {
											fill: "var(--text-muted)",
											fontSize: 10
										},
										axisLine: false,
										tickLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										tick: {
											fill: "var(--text-muted)",
											fontSize: 10
										},
										axisLine: false,
										tickLine: false,
										domain: ["auto", "auto"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
										background: "var(--bg-panel)",
										border: "1px solid var(--border)",
										borderRadius: "8px",
										fontSize: "12px"
									} }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
										type: "monotone",
										dataKey: "nav",
										stroke: "var(--accent-primary)",
										fill: "url(#navGradient)",
										strokeWidth: 2
									})
								]
							})
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "panel p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)]",
							children: "constraint_utilization"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConstraintBars, { ...bars })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 rounded border border-[var(--border)] bg-[var(--bg-base)] p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]",
								children: "status"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-[var(--text-primary)]",
								children: vault.constraint.paused ? "Vault is paused. No actions will execute." : `All constraints within bounds. ${100 - Number(drawdownUtilization)}% drawdown headroom remaining.`
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel mt-6 p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs uppercase tracking-wider text-[var(--accent-policy)]",
					children: "active_policy"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PolicyBlock, { fields: {
						policy_version: vault.policyVersion,
						permission_level: vault.permissionLevel,
						governance: "owner",
						max_drawdown: `${(vault.constraint.maxDrawdownBps / 100).toFixed(0)}%`,
						max_leverage: `${(vault.constraint.maxLeverageBps / 1e4).toFixed(1)}x`,
						signing: "ika_dwallet"
					} })
				})]
			})
		]
	});
}
function ConstraintCard({ label, current, max, unit, utilization }) {
	const isDanger = utilization >= 90;
	const isWarning = utilization >= 70;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "panel p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)]",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: `font-mono text-xs ${isDanger ? "text-[var(--accent-risk)]" : isWarning ? "text-[var(--accent-warning)]" : "text-[var(--accent-secondary)]"}`,
					children: [utilization, "%"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 font-display text-2xl font-semibold",
				children: [current.toFixed(1), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-sm text-[var(--text-muted)]",
					children: [
						"/",
						max.toFixed(1),
						unit
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 h-1.5 overflow-hidden rounded-sm bg-[var(--bg-panel-raised)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `h-full transition-all ${isDanger ? "bg-[var(--accent-risk)]" : isWarning ? "bg-[var(--accent-warning)]" : "bg-[var(--accent-policy)]"}`,
					style: { width: `${Math.min(100, utilization)}%` }
				})
			})
		]
	});
}
//#endregion
export { VaultDashboardPage as component };
