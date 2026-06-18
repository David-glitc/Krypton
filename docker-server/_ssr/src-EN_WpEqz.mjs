import { U as require_jsx_runtime } from "../_libs/@dynamic-labs/sdk-react-core+[...].mjs";
import { t as clsx } from "../_libs/clsx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/src-EN_WpEqz.js
var import_jsx_runtime = require_jsx_runtime();
function PolicyBlock({ fields, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: clsx("rounded border border-[var(--border)] bg-[var(--bg-panel)] p-4 font-mono text-sm", className),
		children: Object.entries(fields).map(([key, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "py-0.5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-[var(--accent-policy)]",
					children: [key, ":"]
				}),
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[var(--text-primary)]",
					children: value
				})
			]
		}, key))
	});
}
function PipelineStrip({ className }) {
	const nodes = [
		{
			id: "policy",
			label: "policy",
			privacy: false
		},
		{
			id: "agents",
			label: "agents",
			privacy: false
		},
		{
			id: "constraints",
			label: "constraints",
			privacy: false
		},
		{
			id: "signing",
			label: "ika_signing",
			privacy: true
		},
		{
			id: "vault",
			label: "vault",
			privacy: false
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: clsx("flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)]", className),
		children: nodes.map((node, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: clsx("rounded border px-3 py-1.5", node.privacy ? "border-[var(--accent-privacy)]/40 bg-[var(--accent-privacy)]/10 text-[var(--accent-privacy)] backdrop-blur-sm" : "border-[var(--border)] bg-[var(--bg-panel)] text-[var(--text-primary)]"),
				children: node.label
			}), i < nodes.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[var(--text-secondary)]",
				children: "→"
			})]
		}, node.id))
	});
}
function ConstraintBars({ drawdown, leverage, concentration }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-4",
		children: [
			{
				label: "drawdown",
				...drawdown,
				unit: "%"
			},
			{
				label: "leverage",
				current: leverage.current / 100,
				max: leverage.max / 100,
				unit: "x"
			},
			{
				label: "concentration",
				...concentration,
				unit: "%"
			}
		].map((bar) => {
			const pct = bar.max > 0 ? Math.min(100, bar.current / bar.max * 100) : 0;
			const danger = pct >= 90;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-1 flex justify-between font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: bar.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					bar.current,
					bar.unit,
					" / ",
					bar.max,
					bar.unit
				] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-2 overflow-hidden rounded-sm bg-[var(--bg-panel-raised)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: clsx("h-full transition-all", danger ? "bg-[var(--accent-risk)]" : "bg-[var(--accent-policy)]"),
					style: { width: `${pct}%` }
				})
			})] }, bar.label);
		})
	});
}
function PendingActionCard({ action, onApprove, onReject }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded border border-[var(--border)] bg-[var(--bg-panel)] p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs uppercase tracking-wider text-[var(--accent-policy)]",
					children: "pending_action"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-1 font-display text-lg text-[var(--text-primary)]",
					children: action.actionType
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "rounded border border-[var(--accent-positive)]/30 bg-[var(--accent-positive)]/10 px-2 py-1 font-mono text-xs text-[var(--accent-positive)]",
					children: ["score ", (action.compositeScore * 100).toFixed(0)]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm leading-relaxed text-[var(--text-secondary)]",
				children: action.rationale
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid gap-3 sm:grid-cols-3",
				children: [
					["expected_return", `${action.expectedReturnPct.toFixed(1)}%`],
					["expected_drawdown", `${action.expectedDrawdownPct.toFixed(1)}%`],
					["var_95", `${action.var95Pct.toFixed(1)}%`]
				].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded border border-[var(--border)] bg-[var(--bg-base)] p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)]",
						children: k
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-mono text-sm text-[var(--text-primary)]",
						children: v
					})]
				}, k))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 font-mono text-xs text-[var(--text-secondary)]",
				children: [
					"post_execution: leverage ",
					(action.postLeverageBps / 100).toFixed(2),
					"x · concentration",
					" ",
					(action.postConcentrationBps / 100).toFixed(1),
					"%"
				]
			}),
			(onApprove || onReject) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-wrap gap-3",
				children: [onApprove && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onApprove,
					className: "rounded border border-[var(--accent-policy)] bg-[var(--accent-policy)] px-4 py-2 font-mono text-xs uppercase tracking-wider text-[var(--bg-base)] transition hover:opacity-90",
					children: "Approve & sign"
				}), onReject && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onReject,
					className: "rounded border border-[var(--border)] px-4 py-2 font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)] transition hover:border-[var(--accent-risk)] hover:text-[var(--accent-risk)]",
					children: "Reject"
				})]
			})
		]
	});
}
//#endregion
export { PolicyBlock as i, PendingActionCard as n, PipelineStrip as r, ConstraintBars as t };
