import "../_runtime.mjs";
import { n as DEMO_VAULTS } from "./mock-data-BoCPJmKJ.mjs";
import { c as Outlet, f as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { U as require_jsx_runtime, n as DynamicContextProvider, r as useDynamicContext, t as ShadowedDynamicUserProfile } from "../_libs/@dynamic-labs/sdk-react-core+[...].mjs";
import { n as KryptonLogo } from "./KryptonLogo-B_df4CUl.mjs";
import { n as isInviteAllowed, t as getInviteHint } from "./invite-CHUafwxM.mjs";
import { t as SolanaWalletConnectors } from "../_libs/@dynamic-labs/solana+[...].mjs";
import { n as oe, t as Ae } from "../_libs/@lazorkit/wallet+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-kbaugDJw.js
var import_jsx_runtime = require_jsx_runtime();
var RPC_URL = "https://api.devnet.solana.com";
/**
* Krypton unified auth — Dynamic (social/email/embedded wallet) + Lazorkit (passkey smart wallet).
*
* Flow:
* 1. Dynamic modal: sign in with X, email, or embedded wallet
* 2. Lazorkit passkey wallet: create/connect a passkey-based smart wallet
* 3. Both wallets are available for different use cases:
*    - Dynamic for easy onboarding (X, email)
*    - Lazorkit for passkey-secured actions
*/
var DYNAMIC_ENV_ID = "d388d3b0-2620-4ef0-8c09-3ace6d0ebbf6";
function KryptonAuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DynamicContextProvider, {
		settings: {
			environmentId: DYNAMIC_ENV_ID,
			walletConnectors: [SolanaWalletConnectors],
			events: { onAuthSuccess: () => {
				console.debug("[KryptonAuth] Dynamic auth success");
			} }
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(oe, {
			rpcUrl: RPC_URL,
			children
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShadowedDynamicUserProfile, {})]
	});
}
function useKryptonAuth() {
	const dynamic = useDynamicContext();
	const lazorkit = Ae();
	return {
		dynamic,
		lazorkit,
		isConnected: dynamic.primaryWallet != null || lazorkit.isConnected,
		primaryAddress: dynamic.primaryWallet?.address ?? lazorkit.wallet?.smartWallet ?? null
	};
}
function AppLayout() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KryptonAuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppGate, {}) });
}
function AppGate() {
	const { isConnected, primaryAddress, dynamic, lazorkit } = useKryptonAuth();
	const allowed = isInviteAllowed(primaryAddress);
	if (!isConnected) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col bg-[var(--bg-base)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b border-[var(--border)] bg-[var(--bg-base)]/80 backdrop-blur-md",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KryptonLogo, {})
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto flex max-w-lg flex-1 flex-col items-center justify-center px-6 py-20 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs uppercase tracking-wider text-[var(--accent-policy)]",
					children: "auth_required"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display mt-4 text-2xl font-semibold",
					children: "Connect your wallet"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-[var(--text-secondary)]",
					children: getInviteHint()
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-xs text-[var(--text-muted)]",
					children: "Use Dynamic (social/email) or Lazorkit (passkey) to connect."
				})
			]
		})]
	});
	if (!allowed) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col bg-[var(--bg-base)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "border-b border-[var(--border)] bg-[var(--bg-base)]/80 backdrop-blur-md",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KryptonLogo, {})
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto flex max-w-lg flex-1 flex-col items-center justify-center px-6 py-20 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-xs uppercase tracking-wider text-[var(--accent-warning)]",
					children: "access_denied"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display mt-4 text-2xl font-semibold",
					children: "Private beta"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-[var(--text-secondary)]",
					children: "Your wallet is not in the beta allowlist. Request access to continue."
				})
			]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh bg-[var(--bg-base)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
			className: "hidden w-56 shrink-0 border-r border-[var(--border)] bg-[var(--bg-panel)]/50 lg:block",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex h-full flex-col",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-b border-[var(--border)] px-4 py-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KryptonLogo, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "flex-1 overflow-y-auto px-3 py-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-2 px-2 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]",
								children: "capital"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarLink, {
								to: "/app",
								children: "Vaults"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarLink, {
								to: "/app/create",
								children: "Create vault"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-4 border-t border-[var(--border)]" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-2 px-2 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]",
								children: "vaults"
							}),
							DEMO_VAULTS.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarLink, {
								to: "/app/vault/$id",
								params: { id: v.id },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: v.name
								})
							}, v.id)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-4 border-t border-[var(--border)]" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-2 px-2 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]",
								children: "resources"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarLink, {
								to: "/docs",
								children: "Policy schema"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-[var(--border)] px-4 py-3",
						children: [primaryAddress && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "truncate font-mono text-xs text-[var(--text-muted)]",
							children: [
								primaryAddress.slice(0, 6),
								"...",
								primaryAddress.slice(-4)
							]
						}), dynamic.primaryWallet != null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => dynamic.setShowDynamicUserProfile?.(true),
							className: "mt-1 font-mono text-[10px] uppercase tracking-wider text-[var(--accent-policy)] hover:underline",
							children: "Profile"
						})]
					})
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 flex-col",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "border-b border-[var(--border)] bg-[var(--bg-base)]/80 backdrop-blur-md lg:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-4 px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KryptonLogo, {}), primaryAddress && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-xs text-[var(--text-muted)]",
						children: [
							primaryAddress.slice(0, 4),
							"...",
							primaryAddress.slice(-4)
						]
					})]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1 overflow-y-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
			})]
		})]
	});
}
function SidebarLink({ to, params, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to,
		params,
		className: "block rounded-lg px-2 py-1.5 font-mono text-xs text-[var(--text-secondary)] transition hover:bg-[var(--bg-panel-raised)] hover:text-[var(--text-primary)]",
		activeProps: { className: "rounded-lg px-2 py-1.5 font-mono text-xs bg-[var(--accent-policy)]/10 text-[var(--accent-policy)]" },
		children
	});
}
//#endregion
export { AppLayout as component };
