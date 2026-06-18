import { U as require_jsx_runtime } from "../_libs/@dynamic-labs/sdk-react-core+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/KryptonLogo-B_df4CUl.js
var import_jsx_runtime = require_jsx_runtime();
var SIZES = {
	sm: 24,
	md: 32,
	lg: 48,
	xl: 64
};
/**
* Krypton hexagon-K logo — purple/green geometric mark
*
*   ┌─┐
*  ╱ K ╲    ← stylised K within a hexagon
*  ╲   ╱
*   └─┘
* Two interlocking triangles form the core, with a K cutout.
*/
function KryptonLogo({ size = "md", className, animated }) {
	const px = SIZES[size];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: px,
		height: px,
		viewBox: "0 0 64 64",
		fill: "none",
		xmlns: "http://www.w3.org/2000/svg",
		className,
		"aria-label": "Krypton",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
				id: "klogo-g",
				x1: "0",
				y1: "0",
				x2: "1",
				y2: "1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "0%",
					stopColor: "var(--accent-primary, #9945FF)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "100%",
					stopColor: "var(--accent-secondary, #14F195)"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
				id: "klogo-g2",
				x1: "0",
				y1: "1",
				x2: "1",
				y2: "0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "0%",
					stopColor: "var(--accent-primary, #9945FF)",
					stopOpacity: "0.3"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
					offset: "100%",
					stopColor: "var(--accent-secondary, #14F195)",
					stopOpacity: "0.15"
				})]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "32",
				cy: "32",
				r: "30",
				fill: "url(#klogo-g2)",
				opacity: "0.5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
				points: "32,4 56,18 56,46 32,60 8,46 8,18",
				fill: "none",
				stroke: "url(#klogo-g)",
				strokeWidth: "2.5",
				strokeLinejoin: "round"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
				points: "32,16 48,32 32,48 16,32",
				fill: "url(#klogo-g)",
				opacity: "0.15"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "22",
				y1: "20",
				x2: "22",
				y2: "44",
				stroke: "url(#klogo-g)",
				strokeWidth: "3",
				strokeLinecap: "round"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "24",
				y1: "32",
				x2: "44",
				y2: "20",
				stroke: "url(#klogo-g)",
				strokeWidth: "2.8",
				strokeLinecap: "round"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "24",
				y1: "32",
				x2: "44",
				y2: "44",
				stroke: "url(#klogo-g)",
				strokeWidth: "2.8",
				strokeLinecap: "round"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
				points: "32,29 35,32 32,35 29,32",
				fill: "var(--accent-secondary, #14F195)",
				opacity: "0.8"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "32",
				cy: "8",
				r: "2",
				fill: "var(--accent-primary, #9945FF)",
				opacity: "0.6"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "56",
				cy: "46",
				r: "2",
				fill: "var(--accent-secondary, #14F195)",
				opacity: "0.6"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "8",
				cy: "46",
				r: "2",
				fill: "var(--accent-secondary, #14F195)",
				opacity: "0.6"
			}),
			animated && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "32",
				cy: "32",
				r: "30",
				fill: "none",
				stroke: "url(#klogo-g)",
				strokeWidth: "1",
				opacity: "0.3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("animateTransform", {
					attributeName: "transform",
					type: "rotate",
					from: "0 32 32",
					to: "360 32 32",
					dur: "8s",
					repeatCount: "indefinite"
				})
			}) })
		]
	});
}
/** Inline SVG favicon — base64-encoded minimal 32x32 mark */
var FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 64 64">
<defs><linearGradient id="g"><stop offset="0%" stop-color="#9945FF"/><stop offset="100%" stop-color="#14F195"/></linearGradient></defs>
<polygon points="32,8 52,20 52,44 32,56 12,44 12,20" fill="none" stroke="url(#g)" stroke-width="3"/>
<polygon points="32,18 46,32 32,46 18,32" fill="url(#g)" opacity="0.2"/>
<line x1="22" y1="22" x2="22" y2="42" stroke="url(#g)" stroke-width="3.5" stroke-linecap="round"/>
<line x1="24" y1="32" x2="42" y2="22" stroke="url(#g)" stroke-width="3" stroke-linecap="round"/>
<line x1="24" y1="32" x2="42" y2="42" stroke="url(#g)" stroke-width="3" stroke-linecap="round"/>
<polygon points="32,30 34,32 32,34 30,32" fill="#14F195"/>
</svg>`;
//#endregion
export { KryptonLogo as n, FAVICON_SVG as t };
