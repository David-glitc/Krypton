import { n as DEMO_VAULTS } from "./mock-data-BoCPJmKJ.mjs";
import { f as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { U as require_jsx_runtime } from "../_libs/@dynamic-labs/sdk-react-core+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-C_xDG2FE.js
var import_jsx_runtime = require_jsx_runtime();
function VaultCard({ vault }) {
	const drawdownPct = (vault.constraint.currentDrawdownBps / vault.constraint.maxDrawdownBps * 100).toFixed(0);
	const leveragePct = (vault.constraint.currentLeverageBps / vault.constraint.maxLeverageBps * 100).toFixed(0);
	const isDanger = Number(drawdownPct) >= 90 || Number(leveragePct) >= 90;
	const isWarning = Number(drawdownPct) >= 70 || Number(leveragePct) >= 70;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/app/vault/$id",
		params: { id: vault.id },
		className: "panel block p-5 transition hover:bg-[var(--bg-panel-raised)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-mono text-lg text-[var(--text-primary)]",
					children: vault.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 font-mono text-sm text-[var(--accent-policy)]",
					children: [
						"$",
						vault.navUsd.toLocaleString(),
						" NAV"
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [vault.constraint.paused && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded bg-[var(--accent-risk)]/10 px-2 py-0.5 font-mono text-[10px] uppercase text-[var(--accent-risk)]",
						children: "paused"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-xs text-[var(--text-secondary)]",
						children: ["L", vault.permissionLevel]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConstraintMiniBar, {
					label: "drawdown",
					current: vault.constraint.currentDrawdownBps / 100,
					max: vault.constraint.maxDrawdownBps / 100,
					unit: "%",
					isDanger,
					isWarning
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConstraintMiniBar, {
					label: "leverage",
					current: vault.constraint.currentLeverageBps / 1e4,
					max: vault.constraint.maxLeverageBps / 1e4,
					unit: "x"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex items-center justify-between text-xs text-[var(--text-muted)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Policy v", vault.policyVersion] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: vault.constraint.paused ? "Paused" : "Active" })]
			})
		]
	});
}
function ConstraintMiniBar({ label, current, max, unit, isDanger, isWarning }) {
	const pct = max > 0 ? Math.min(100, current / max * 100) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-0.5 flex justify-between font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
			current.toFixed(1),
			unit,
			" / ",
			max.toFixed(1),
			unit
		] })]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-1.5 overflow-hidden rounded-sm bg-[var(--bg-panel-raised)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `h-full transition-all ${isDanger ? "bg-[var(--accent-risk)]" : isWarning ? "bg-[var(--accent-warning)]" : "bg-[var(--accent-policy)]"}`,
			style: { width: `${pct}%` }
		})
	})] });
}
function VaultListPage() {
	const totalNav = DEMO_VAULTS.reduce((sum, v) => sum + v.navUsd, 0);
	const activeVaults = DEMO_VAULTS.filter((v) => !v.constraint.paused).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-6 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs uppercase tracking-wider text-[var(--accent-policy)]",
					children: "capital: your_vaults"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display mt-2 text-3xl font-semibold",
					children: "Vaults"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/app/create",
					className: "btn-primary text-xs",
					children: "New vault"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid grid-cols-3 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "panel p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]",
							children: "total_nav"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 font-display text-xl font-semibold",
							children: ["$", totalNav.toLocaleString()]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "panel p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]",
							children: "active_vaults"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 font-display text-xl font-semibold",
							children: [
								activeVaults,
								"/",
								DEMO_VAULTS.length
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "panel p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-xs uppercase tracking-wider text-[var(--text-muted)]",
							children: "constraint_checks"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 font-display text-xl font-semibold",
							children: ["8", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-[var(--text-muted)]",
								children: "/action"
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid gap-4 md:grid-cols-2",
				children: DEMO_VAULTS.map((vault) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VaultCard, { vault }, vault.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 panel p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)]",
					children: "quick_actions"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/app/create",
						className: "btn-secondary text-xs",
						children: "Create new vault"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/docs",
						className: "btn-ghost text-xs",
						children: "View policy schema"
					})]
				})]
			})
		]
	});
}
//#endregion
export { VaultListPage as component };
