import { a as useLocation, d as createRootRoute, f as Link, h as ErrorComponent, i as HeadContent, m as useRouter, r as Scripts } from "./_libs/@tanstack/react-router+[...].mjs";
import { U as require_jsx_runtime } from "./_libs/@dynamic-labs/sdk-react-core+[...].mjs";
import { n as KryptonLogo, t as FAVICON_SVG } from "./_ssr/KryptonLogo-B_df4CUl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/__root-BuMiPQ8f.js
var import_jsx_runtime = require_jsx_runtime();
function DefaultCatchBoundary({ error }) {
	const router = useRouter();
	const isRoot = useLocation({ select: (location) => location.pathname === "/" });
	console.error("DefaultCatchBoundary Error:", error);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0 flex-1 p-4 flex flex-col items-center justify-center gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorComponent, { error }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-2 items-center flex-wrap",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => {
					router.invalidate();
				},
				className: `px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded-sm text-white uppercase font-extrabold`,
				children: "Try Again"
			}), isRoot ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: `px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded-sm text-white uppercase font-extrabold`,
				children: "Home"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: `px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded-sm text-white uppercase font-extrabold`,
				onClick: (e) => {
					e.preventDefault();
					window.history.back();
				},
				children: "Go Back"
			})]
		})]
	});
}
function NotFound({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2 p-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-gray-600 dark:text-gray-400",
			children: children || /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "The page you are looking for does not exist." })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "flex items-center gap-2 flex-wrap",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => window.history.back(),
				className: "bg-emerald-500 text-white px-2 py-1 rounded-sm uppercase font-black text-sm",
				children: "Go back"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "bg-cyan-600 text-white px-2 py-1 rounded-sm uppercase font-black text-sm",
				children: "Start Over"
			})]
		})]
	});
}
var app_default = "/assets/app-wjDjGD9U.css";
function seo({ title, description }) {
	return [
		{ title },
		{
			name: "description",
			content: description
		},
		{
			name: "og:title",
			content: title
		},
		{
			name: "og:description",
			content: description
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	];
}
var Route = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			...seo({
				title: "Krypton — Agentic Capital Automation for Solana",
				description: "Define a Capital Policy — objectives, risk envelope, execution mandate. AI agent pipeline proposes actions. On-chain Constraint Engine enforces every trade."
			})
		],
		links: [{
			rel: "stylesheet",
			href: app_default
		}, {
			rel: "icon",
			type: "image/svg+xml",
			href: `data:image/svg+xml,${encodeURIComponent(FAVICON_SVG)}`
		}]
	}),
	errorComponent: DefaultCatchBoundary,
	notFoundComponent: () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotFound, {}),
	shellComponent: RootDocument
});
function RootDocument({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "min-h-dvh antialiased",
			children: [
				children,
				false,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	});
}
function SiteHeader() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "border-b border-[var(--border)] bg-[var(--bg-base)]/80 backdrop-blur-md",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "flex items-center gap-2 font-display text-lg font-semibold tracking-tight",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KryptonLogo, { size: "sm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "gradient-text",
					children: "Krypton"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "flex items-center gap-5 font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/docs",
						className: "hover:text-[var(--text-primary)] transition-colors",
						children: "Docs"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/app",
						className: "hover:text-[var(--text-primary)] transition-colors",
						children: "App"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/app/create",
						className: "btn-primary text-xs",
						children: "Create vault"
					})
				]
			})]
		})
	});
}
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "border-t border-[var(--border)] py-12",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KryptonLogo, { size: "sm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-sm font-semibold text-[var(--text-secondary)]",
						children: "Krypton"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm leading-relaxed text-[var(--text-muted)]",
					children: "Krypton is infrastructure, not an investment adviser. Capital is at risk."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 font-mono text-xs text-[var(--text-muted)]",
					children: "Working name · subject to brand review"
				})
			]
		})
	});
}
function PageShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { Route as i, NotFound as n, PageShell as r, DefaultCatchBoundary as t };
