import { f as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { U as require_jsx_runtime } from "../_libs/@dynamic-labs/sdk-react-core+[...].mjs";
import { i as PolicyBlock } from "./src-EN_WpEqz.mjs";
import { r as PageShell } from "../__root-BuMiPQ8f.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/docs-N8ldwYPf.js
var import_jsx_runtime = require_jsx_runtime();
function DocsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl px-6 py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl font-semibold",
				children: "Policy schema reference"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-[var(--text-secondary)]",
				children: [
					"Canonical Capital Policy fields stored off-chain (Arweave) with hash anchored on-chain in",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
						className: "font-mono text-[var(--accent-policy)]",
						children: "PolicyAccount"
					}),
					"."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PolicyBlock, { fields: {
						policy_version: "1",
						objective: "maximize_risk_adjusted_return",
						risk_profile: "low | medium | high | custom",
						max_drawdown_pct: "1–50",
						max_leverage: "≤ 2.0 (protocol cap)",
						execution_mode: "advisory | constrained_auto | full_auto",
						governance_mode: "owner | dao_prediction_market"
					} }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "panel p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl font-medium",
							children: "Permission levels"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-4 space-y-2 text-sm text-[var(--text-secondary)]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-[var(--text-primary)]",
										children: "Level 2 (beta default):"
									}),
									" ",
									"pipeline runs; owner signs each execution"
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-[var(--text-primary)]",
									children: "Level 3:"
								}), " constrained auto-execute when on-chain checks pass"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "text-[var(--text-primary)]",
									children: "Level 4:"
								}), " same contract path as L3; UX-only distinction (disabled in private beta)"] })
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "panel p-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl font-medium",
							children: "Constraint Engine checks"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-sm text-[var(--text-secondary)]",
							children: [
								"All enforced at ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
									className: "font-mono",
									children: "execute_action"
								}),
								" — leverage, concentration, correlated exposure, drawdown, protocol/asset whitelist, liquidity floor, oracle staleness."
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/app/create",
					className: "btn-primary",
					children: "Open policy builder"
				})
			})
		]
	}) });
}
//#endregion
export { DocsPage as component };
