import { s as __toESM } from "../_runtime.mjs";
import { a as getVault, t as DEMO_PENDING_ACTIONS } from "./mock-data-BoCPJmKJ.mjs";
import { I as require_react } from "../_libs/dynamic-labs__iconic+react.mjs";
import { f as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { U as require_jsx_runtime } from "../_libs/@dynamic-labs/sdk-react-core+[...].mjs";
import { n as PendingActionCard } from "./src-EN_WpEqz.mjs";
import { t as Route } from "./vault._id.activity-Caihp8me.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vault._id.activity-DRVCGvIN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ActivityFeed({ entries }) {
	if (entries.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-[var(--text-muted)]",
		children: "No activity yet."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-3",
		children: entries.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityRow, { entry }, entry.id))
	});
}
function ActivityRow({ entry }) {
	const icon = typeIcon[entry.type];
	const color = typeColor[entry.type];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg-panel)] p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${color}`,
			children: icon
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-[var(--text-primary)]",
					children: entry.description
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "shrink-0 font-mono text-[10px] text-[var(--text-muted)]",
					children: formatTime(entry.timestamp)
				})]
			}), entry.details && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1.5 flex flex-wrap gap-1.5",
				children: Object.entries(entry.details).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "rounded bg-[var(--bg-panel-raised)] px-1.5 py-0.5 font-mono text-[9px] text-[var(--text-muted)]",
					children: [
						k,
						": ",
						v
					]
				}, k))
			})]
		})]
	});
}
var typeIcon = {
	executed: "✓",
	rejected: "✗",
	advisory_pending: "⏳",
	policy_amended: "📝",
	deposit: "↓",
	withdrawal: "↑",
	paused: "⏸",
	unpaused: "▶"
};
var typeColor = {
	executed: "bg-[var(--accent-secondary)]/10 text-[var(--accent-secondary)]",
	rejected: "bg-[var(--accent-risk)]/10 text-[var(--accent-risk)]",
	advisory_pending: "bg-[var(--accent-warning)]/10 text-[var(--accent-warning)]",
	policy_amended: "bg-[var(--accent-policy)]/10 text-[var(--accent-policy)]",
	deposit: "bg-[var(--accent-secondary)]/10 text-[var(--accent-secondary)]",
	withdrawal: "bg-[var(--accent-primary)]/10 text-[var(--accent-primary)]",
	paused: "bg-[var(--accent-warning)]/10 text-[var(--accent-warning)]",
	unpaused: "bg-[var(--accent-secondary)]/10 text-[var(--accent-secondary)]"
};
function formatTime(timestamp) {
	const d = new Date(timestamp);
	const diffMs = (/* @__PURE__ */ new Date()).getTime() - d.getTime();
	const diffMin = Math.floor(diffMs / 6e4);
	if (diffMin < 1) return "just now";
	if (diffMin < 60) return `${diffMin}m ago`;
	const diffHr = Math.floor(diffMin / 60);
	if (diffHr < 24) return `${diffHr}h ago`;
	return d.toLocaleDateString();
}
var DEMO_ACTIVITY = [
	{
		id: "act-1",
		vaultId: "vault-alpha",
		type: "executed",
		description: "Swap 500 USDC → SOL via Jupiter",
		timestamp: (/* @__PURE__ */ new Date(Date.now() - 36e5)).toISOString(),
		details: {
			cycle: "4820",
			score: "74",
			impact: "+$1,240"
		}
	},
	{
		id: "act-2",
		vaultId: "vault-alpha",
		type: "rejected",
		description: "Leverage increase to 2.3x rejected by Constraint Engine",
		timestamp: (/* @__PURE__ */ new Date(Date.now() - 72e5)).toISOString(),
		details: {
			cycle: "4819",
			reason: "exceeds policy max 2.0x"
		}
	},
	{
		id: "act-3",
		vaultId: "vault-alpha",
		type: "executed",
		description: "Deposit 2,500 USDC",
		timestamp: (/* @__PURE__ */ new Date(Date.now() - 864e5)).toISOString(),
		details: { shares: "2,450" }
	},
	{
		id: "act-4",
		vaultId: "vault-alpha",
		type: "policy_amended",
		description: "Policy updated to v2 — drawdown limit 10% → 12%",
		timestamp: (/* @__PURE__ */ new Date(Date.now() - 1728e5)).toISOString(),
		details: { v: "1 → 2" }
	},
	{
		id: "act-5",
		vaultId: "vault-alpha",
		type: "advisory_pending",
		description: "Rebalance 30% SOL → JitoSOL for yield optimization",
		timestamp: (/* @__PURE__ */ new Date(Date.now() - 3e5)).toISOString(),
		details: {
			score: "68",
			est_return: "+2.4%"
		}
	}
];
function VaultActivityPage() {
	const { id } = Route.useParams();
	const vault = getVault(id);
	const [actions, setActions] = (0, import_react.useState)(DEMO_PENDING_ACTIONS[id] ?? []);
	const [message, setMessage] = (0, import_react.useState)(null);
	const [filter, setFilter] = (0, import_react.useState)("all");
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
	function handleApprove(actionId) {
		setMessage(`Approved ${actionId} — wallet will sign execute_action (devnet stub).`);
		setActions((prev) => prev.filter((a) => a.id !== actionId));
	}
	function handleReject(actionId) {
		setMessage(`Rejected ${actionId} — logged to ExecutionLog.`);
		setActions((prev) => prev.filter((a) => a.id !== actionId));
	}
	const filteredActivity = DEMO_ACTIVITY.filter((a) => {
		if (filter === "pending") return a.type === "advisory_pending";
		if (filter === "history") return a.type !== "advisory_pending";
		return true;
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
				children: "Activity"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-[var(--text-secondary)]",
				children: [
					"Level ",
					vault.permissionLevel,
					" — your vault enforces manual approval before execution."
				]
			}),
			message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 rounded border border-[var(--accent-positive)]/40 bg-[var(--accent-positive)]/10 p-3 text-sm text-[var(--accent-positive)]",
				children: message
			}),
			actions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-mono text-xs uppercase tracking-wider text-[var(--accent-policy)]",
					children: [
						"pending_actions (",
						actions.length,
						")"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 space-y-4",
					children: actions.map((action) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PendingActionCard, {
						action,
						onApprove: () => handleApprove(action.id),
						onReject: () => handleReject(action.id)
					}, action.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)]",
						children: "execution_log"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-1",
						children: [
							"all",
							"pending",
							"history"
						].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setFilter(f),
							className: `rounded px-2 py-1 font-mono text-[10px] uppercase tracking-wider transition ${filter === f ? "bg-[var(--accent-policy)]/10 text-[var(--accent-policy)]" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"}`,
							children: f
						}, f))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityFeed, { entries: filteredActivity })
				})]
			})
		]
	});
}
//#endregion
export { VaultActivityPage as component };
