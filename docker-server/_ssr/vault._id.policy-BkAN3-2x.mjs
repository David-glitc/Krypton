import { a as getVault } from "./mock-data-BoCPJmKJ.mjs";
import { f as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { U as require_jsx_runtime } from "../_libs/@dynamic-labs/sdk-react-core+[...].mjs";
import { i as PolicyBlock } from "./src-EN_WpEqz.mjs";
import { t as Route } from "./vault._id.policy-DvOmSp3x.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vault._id.policy-BkAN3-2x.js
var import_jsx_runtime = require_jsx_runtime();
function VaultPolicyPage() {
	const { id } = Route.useParams();
	const vault = getVault(id);
	if (!vault) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-6 py-20 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[var(--accent-risk)]",
			children: "Vault not found"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/app",
			className: "btn-secondary mt-6 inline-flex",
			children: "Back"
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-6 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/app/vault/$id",
				params: { id },
				className: "font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--accent-policy)]",
				children: ["← ", vault.name]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display mt-4 text-3xl font-semibold",
				children: "Policy"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-[var(--text-secondary)]",
				children: "Owner mode — amend by signing a new policy version (devnet stub until Phase 1)."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel mt-8 p-6",
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
						max_position: `${(vault.constraint.maxPositionBps / 100).toFixed(0)}%`,
						signing: "ika_dwallet"
					} })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel mt-6 p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)]",
						children: "amendment"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm text-[var(--text-secondary)]",
						children: [
							"Policy amendments hash canonical JSON off-chain and write a new version to",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
								className: "font-mono text-[var(--accent-policy)]",
								children: "PolicyAccount"
							}),
							". Prior versions remain queryable for audit."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/app/create",
						className: "btn-secondary mt-6 inline-flex",
						children: "Open policy builder"
					})
				]
			})
		]
	});
}
//#endregion
export { VaultPolicyPage as component };
