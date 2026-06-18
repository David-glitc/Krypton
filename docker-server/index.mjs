globalThis.__nitro_main__ = import.meta.url;
import { a as toEventHandler, c as serve, i as defineLazyEventHandler, n as HTTPError, r as defineHandler, s as NodeResponse, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import "./_libs/hookable.mjs";
import { i as withoutTrailingSlash, n as joinURL, r as withLeadingSlash, t as decodePath } from "./_libs/ufo.mjs";
import { promises } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region ../../node_modules/.pnpm/nitro@3.0.260311-beta_chokidar@5.0.0_idb-keyval@6.2.5_jiti@2.7.0_lru-cache@11.5.1_rollu_13dcb70debce3f1487324acdc59c4754/node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new NodeResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region ../../node_modules/.pnpm/nitro@3.0.260311-beta_chokidar@5.0.0_idb-keyval@6.2.5_jiti@2.7.0_lru-cache@11.5.1_rollu_13dcb70debce3f1487324acdc59c4754/node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/android-chrome-192x192.png": {
		"type": "image/png",
		"etag": "\"750c-oU2mem0jjZ8XbVMelLzRr7WdVPI\"",
		"mtime": "2026-06-17T21:53:28.692Z",
		"size": 29964,
		"path": "../public/android-chrome-192x192.png"
	},
	"/android-chrome-512x512.png": {
		"type": "image/png",
		"etag": "\"1aad7-TxqzM3JFMTytpE8GX+/4lMPNyzQ\"",
		"mtime": "2026-06-17T21:53:28.689Z",
		"size": 109271,
		"path": "../public/android-chrome-512x512.png"
	},
	"/apple-touch-icon.png": {
		"type": "image/png",
		"etag": "\"6a6e-DDBGYLGi+sElNLs2+1QICHz5lS4\"",
		"mtime": "2026-06-17T21:53:28.689Z",
		"size": 27246,
		"path": "../public/apple-touch-icon.png"
	},
	"/favicon-16x16.png": {
		"type": "image/png",
		"etag": "\"340-GSBMkU3R13NnICO2UG+wPm8sJhM\"",
		"mtime": "2026-06-17T21:53:28.691Z",
		"size": 832,
		"path": "../public/favicon-16x16.png"
	},
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"3c2e-R2UvDwRFCsnzRE8fcnOLMp5+Svo\"",
		"mtime": "2026-06-17T21:53:28.689Z",
		"size": 15406,
		"path": "../public/favicon.ico"
	},
	"/favicon.png": {
		"type": "image/png",
		"etag": "\"5e3-23JXQ+bzISswdmRT9DhqqHtr9xM\"",
		"mtime": "2026-06-17T21:53:28.691Z",
		"size": 1507,
		"path": "../public/favicon.png"
	},
	"/site.webmanifest": {
		"type": "application/manifest+json",
		"etag": "\"168-OLZYaPbcgi7SF/odatSUJ7DocfI\"",
		"mtime": "2026-06-17T21:53:28.692Z",
		"size": 360,
		"path": "../public/site.webmanifest"
	},
	"/assets/app-Cxsvg8AK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"118b-zha/KuOtZMJW17i+KJy4lCX9ghI\"",
		"mtime": "2026-06-17T21:53:26.474Z",
		"size": 4491,
		"path": "../public/assets/app-Cxsvg8AK.js"
	},
	"/assets/app-wjDjGD9U.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"8dfa-Yu6t7Tg4Kr3jrTei7xEUb2Jwjf0\"",
		"mtime": "2026-06-17T21:53:26.484Z",
		"size": 36346,
		"path": "../public/assets/app-wjDjGD9U.css"
	},
	"/assets/browser-Dli20sdb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ca-3HBDhyA3y3jpgreHNyfKRkzsRug\"",
		"mtime": "2026-06-17T21:53:26.474Z",
		"size": 202,
		"path": "../public/assets/browser-Dli20sdb.js"
	},
	"/assets/chunk-CJJwijRH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4f9-7b24JJoyebzMrxLCyg7rNdQckU0\"",
		"mtime": "2026-06-17T21:53:26.474Z",
		"size": 1273,
		"path": "../public/assets/chunk-CJJwijRH.js"
	},
	"/assets/dist-BrZ5Ny2P.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"55e-H3KyyVcbw1dtF7b4jZRJ/AT5BXE\"",
		"mtime": "2026-06-17T21:53:26.474Z",
		"size": 1374,
		"path": "../public/assets/dist-BrZ5Ny2P.js"
	},
	"/assets/dist-BuyRd4Pl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"17aa-NXa26+yWLgfvuNL+7savDnALi9M\"",
		"mtime": "2026-06-17T21:53:26.475Z",
		"size": 6058,
		"path": "../public/assets/dist-BuyRd4Pl.js"
	},
	"/assets/connect-solana-BnRxy0Bs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26e49-LjmDZHvLtGJc6kx4/PTCr4ate6s\"",
		"mtime": "2026-06-17T21:53:26.474Z",
		"size": 159305,
		"path": "../public/assets/connect-solana-BnRxy0Bs.js"
	},
	"/favicon-32x32.png": {
		"type": "image/png",
		"etag": "\"843-o7V/FkCz36zCpGs0pydBZ+gbsCw\"",
		"mtime": "2026-06-17T21:53:28.689Z",
		"size": 2115,
		"path": "../public/favicon-32x32.png"
	},
	"/assets/docs-Cgn6rejI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"923-Dn/SzQete0VmDcEXRBYfDO29i+0\"",
		"mtime": "2026-06-17T21:53:26.475Z",
		"size": 2339,
		"path": "../public/assets/docs-Cgn6rejI.js"
	},
	"/assets/elliptic_curves-BphKRxu5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8b9-nFBWw1hD73dSI0MkRF3xZ0DMYjY\"",
		"mtime": "2026-06-17T21:53:26.475Z",
		"size": 2233,
		"path": "../public/assets/elliptic_curves-BphKRxu5.js"
	},
	"/assets/esm-CoSDrkI5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"18e0-aoVSiKozd0HizKhl5mrj+Ur2voM\"",
		"mtime": "2026-06-17T21:53:26.475Z",
		"size": 6368,
		"path": "../public/assets/esm-CoSDrkI5.js"
	},
	"/assets/eventemitter3-BgM8te56.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5e0d-D2evkL8BII47zymzSsGfLfb12eM\"",
		"mtime": "2026-06-17T21:53:26.475Z",
		"size": 24077,
		"path": "../public/assets/eventemitter3-BgM8te56.js"
	},
	"/assets/eventemitter3-Di4QU9Cs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"aee-Yom6JZUNKVRMdXhDn4MZdlmUDuM\"",
		"mtime": "2026-06-17T21:53:26.476Z",
		"size": 2798,
		"path": "../public/assets/eventemitter3-Di4QU9Cs.js"
	},
	"/assets/create-0SP1OTyt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"147fb-a0+TlKQbbbdDZDtLYEMaIhVEpfU\"",
		"mtime": "2026-06-17T21:53:26.474Z",
		"size": 83963,
		"path": "../public/assets/create-0SP1OTyt.js"
	},
	"/assets/dist-C-U7E9GH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1cedf-P3fI/NOrpXxpfL7zuGRsed5BjQ4\"",
		"mtime": "2026-06-17T21:53:26.475Z",
		"size": 118495,
		"path": "../public/assets/dist-C-U7E9GH.js"
	},
	"/assets/dist-Cpdcv-_X.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1df19-/buOH4kQFb6xGtnsrZEu5x4V53c\"",
		"mtime": "2026-06-17T21:53:26.475Z",
		"size": 122649,
		"path": "../public/assets/dist-Cpdcv-_X.js"
	},
	"/assets/hmac-DhZobDqD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"33e1-4Qff2t8CEop9CKe/l0a52kxWAW0\"",
		"mtime": "2026-06-17T21:53:26.476Z",
		"size": 13281,
		"path": "../public/assets/hmac-DhZobDqD.js"
	},
	"/assets/index-COb4mCuP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"45dc5-xE8AsHc+lBzxg136wR1amKP1csc\"",
		"mtime": "2026-06-17T21:53:26.473Z",
		"size": 286149,
		"path": "../public/assets/index-COb4mCuP.js"
	},
	"/assets/invite-DCcOuQy3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a2-HGS+fBH2ohaTKMrTtxeplP46d94\"",
		"mtime": "2026-06-17T21:53:26.476Z",
		"size": 162,
		"path": "../public/assets/invite-DCcOuQy3.js"
	},
	"/assets/link-CHECQpzJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"870d-jDgJX7PA03m5ST+FwX+fXYS7mLU\"",
		"mtime": "2026-06-17T21:53:26.476Z",
		"size": 34573,
		"path": "../public/assets/link-CHECQpzJ.js"
	},
	"/assets/loader-BlcFDDT7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"322-Q2sr9PaUc/9vqleXYeTE7Wn1PHQ\"",
		"mtime": "2026-06-17T21:53:26.476Z",
		"size": 802,
		"path": "../public/assets/loader-BlcFDDT7.js"
	},
	"/assets/index-de0119fe-DKncn-hP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3df3-Jo8AMyxwZP/dCjJbTLP9R4AM/gU\"",
		"mtime": "2026-06-17T21:53:26.476Z",
		"size": 15859,
		"path": "../public/assets/index-de0119fe-DKncn-hP.js"
	},
	"/assets/matchContext-BDDIesDT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2e5-R+nnmL5YbW6dSg/7AWAEpZJCL9M\"",
		"mtime": "2026-06-17T21:53:26.476Z",
		"size": 741,
		"path": "../public/assets/matchContext-BDDIesDT.js"
	},
	"/assets/mock-data-CdzHgrNc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"599-qG9XlcyrAMidDG/1g5i8UGXbi0o\"",
		"mtime": "2026-06-17T21:53:26.476Z",
		"size": 1433,
		"path": "../public/assets/mock-data-CdzHgrNc.js"
	},
	"/assets/mm-install-modal_2.entry-Bjr7fvox.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f91d-/CbxTGx1wPNvm2iAJM67XLcJiGg\"",
		"mtime": "2026-06-17T21:53:26.476Z",
		"size": 63773,
		"path": "../public/assets/mm-install-modal_2.entry-Bjr7fvox.js"
	},
	"/assets/nodecrypto-eZ3acP4z.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"188-l9FLJW/MpLDvGQhZkhk7y6gb55M\"",
		"mtime": "2026-06-17T21:53:26.477Z",
		"size": 392,
		"path": "../public/assets/nodecrypto-eZ3acP4z.js"
	},
	"/assets/modular-rMAfIx5Y.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"19b0a-XUukJhz5493myzjqibKlfeem3ys\"",
		"mtime": "2026-06-17T21:53:26.477Z",
		"size": 105226,
		"path": "../public/assets/modular-rMAfIx5Y.js"
	},
	"/assets/pako.esm-DPn-aQFz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"126f8-omCLzkVHkcxbNZQg3lyl6UYwDVU\"",
		"mtime": "2026-06-17T21:53:26.477Z",
		"size": 75512,
		"path": "../public/assets/pako.esm-DPn-aQFz.js"
	},
	"/assets/purejs-Cg3p_5oG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a71-D3LaRgLmUODRUP9qHfIzUFPTAXU\"",
		"mtime": "2026-06-17T21:53:26.477Z",
		"size": 2673,
		"path": "../public/assets/purejs-Cg3p_5oG.js"
	},
	"/assets/route-BpUffYw9.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ee0-FbZgX13GxFlPq0sjGr7N2FWEUUg\"",
		"mtime": "2026-06-17T21:53:26.477Z",
		"size": 3808,
		"path": "../public/assets/route-BpUffYw9.js"
	},
	"/assets/routes-CJBDCKfu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3009-kz+9pBoEMyNMb6ZRUlGta8viTFQ\"",
		"mtime": "2026-06-17T21:53:26.482Z",
		"size": 12297,
		"path": "../public/assets/routes-CJBDCKfu.js"
	},
	"/assets/secp256k1-C8JNT1v3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"61f7-RkRs6VDXki+ZqxH02CEHnDJpY1c\"",
		"mtime": "2026-06-17T21:53:26.482Z",
		"size": 25079,
		"path": "../public/assets/secp256k1-C8JNT1v3.js"
	},
	"/assets/sha256-uint8array-Bpfr4x8F.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"798e-mRufeCO2/WyfhCp8EepFfewBepg\"",
		"mtime": "2026-06-17T21:53:26.482Z",
		"size": 31118,
		"path": "../public/assets/sha256-uint8array-Bpfr4x8F.js"
	},
	"/assets/src-Cqj9fWms.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"12a5-+iOdLmsPlV3+QvvnzltmCU3sW6I\"",
		"mtime": "2026-06-17T21:53:26.482Z",
		"size": 4773,
		"path": "../public/assets/src-Cqj9fWms.js"
	},
	"/assets/thumbmark.esm-CUeBwqCi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4438-3Fb9VfOEEQ/2iXA3RUy3+oahP3I\"",
		"mtime": "2026-06-17T21:53:26.482Z",
		"size": 17464,
		"path": "../public/assets/thumbmark.esm-CUeBwqCi.js"
	},
	"/assets/useNavigate-CCn4jLd2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d9-RotqVJR60JR2LxKIovnaLO3qFTE\"",
		"mtime": "2026-06-17T21:53:26.483Z",
		"size": 217,
		"path": "../public/assets/useNavigate-CCn4jLd2.js"
	},
	"/assets/tslib.es6-BwM4sMrh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2ba5-8+BBzX1XXu4GPGCNvrxSWnUAhO0\"",
		"mtime": "2026-06-17T21:53:26.482Z",
		"size": 11173,
		"path": "../public/assets/tslib.es6-BwM4sMrh.js"
	},
	"/assets/utils-PAv_Hbcx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"18b-QzDh9gIn7Hc9k/GF75jCYqxPSAY\"",
		"mtime": "2026-06-17T21:53:26.483Z",
		"size": 395,
		"path": "../public/assets/utils-PAv_Hbcx.js"
	},
	"/assets/v4-DIgz8zy6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3f9-PDRUpO1DFUfAZZMh5p4TndXAgkU\"",
		"mtime": "2026-06-17T21:53:26.483Z",
		"size": 1017,
		"path": "../public/assets/v4-DIgz8zy6.js"
	},
	"/assets/vault._id.activity-CKSp3Vd4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"167f-bUSceIUEDwVkVuHLa/WUkYrT5/A\"",
		"mtime": "2026-06-17T21:53:26.483Z",
		"size": 5759,
		"path": "../public/assets/vault._id.activity-CKSp3Vd4.js"
	},
	"/assets/vault._id-CVWgCtAg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"56e96-q8qa1jVINHDpL95SZLH+SsJn5SQ\"",
		"mtime": "2026-06-17T21:53:26.483Z",
		"size": 355990,
		"path": "../public/assets/vault._id-CVWgCtAg.js"
	},
	"/assets/vault._id.policy-BRSZDteZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"86b-G7ZxVzNDBRQLn8RmeQxxNRle8Q0\"",
		"mtime": "2026-06-17T21:53:26.484Z",
		"size": 2155,
		"path": "../public/assets/vault._id.policy-BRSZDteZ.js"
	},
	"/assets/webcrypto-CtFtl0n_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4eb-6OhljbhUfuNnzCxkZ8p4IO8CegI\"",
		"mtime": "2026-06-17T21:53:26.484Z",
		"size": 1259,
		"path": "../public/assets/webcrypto-CtFtl0n_.js"
	},
	"/assets/route-DOvM0wMo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"352b47-5rFxkzeQtay8vZRNwUB24aL+xzM\"",
		"mtime": "2026-06-17T21:53:26.477Z",
		"size": 3484487,
		"path": "../public/assets/route-DOvM0wMo.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets-node
function readAsset(id) {
	const serverDir = dirname(fileURLToPath(globalThis.__nitro_main__));
	return promises.readFile(resolve(serverDir, public_assets_data_default[id].path));
}
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
function getAsset(id) {
	return public_assets_data_default[id];
}
//#endregion
//#region ../../node_modules/.pnpm/nitro@3.0.260311-beta_chokidar@5.0.0_idb-keyval@6.2.5_jiti@2.7.0_lru-cache@11.5.1_rollu_13dcb70debce3f1487324acdc59c4754/node_modules/nitro/dist/runtime/internal/static.mjs
var METHODS = new Set(["HEAD", "GET"]);
var EncodingMap = {
	gzip: ".gz",
	br: ".br",
	zstd: ".zst"
};
var static_default = defineHandler((event) => {
	if (event.req.method && !METHODS.has(event.req.method)) return;
	let id = decodePath(withLeadingSlash(withoutTrailingSlash(event.url.pathname)));
	let asset;
	const encodings = [...(event.req.headers.get("accept-encoding") || "").split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(), ""];
	for (const encoding of encodings) for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
		const _asset = getAsset(_id);
		if (_asset) {
			asset = _asset;
			id = _id;
			break;
		}
	}
	if (!asset) {
		if (isPublicAssetURL(id)) {
			event.res.headers.delete("Cache-Control");
			throw new HTTPError({ status: 404 });
		}
		return;
	}
	if (encodings.length > 1) event.res.headers.append("Vary", "Accept-Encoding");
	if (event.req.headers.get("if-none-match") === asset.etag) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	const ifModifiedSinceH = event.req.headers.get("if-modified-since");
	const mtimeDate = new Date(asset.mtime);
	if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	if (asset.type) event.res.headers.set("Content-Type", asset.type);
	if (asset.etag && !event.res.headers.has("ETag")) event.res.headers.set("ETag", asset.etag);
	if (asset.mtime && !event.res.headers.has("Last-Modified")) event.res.headers.set("Last-Modified", mtimeDate.toUTCString());
	if (asset.encoding && !event.res.headers.has("Content-Encoding")) event.res.headers.set("Content-Encoding", asset.encoding);
	if (asset.size > 0 && !event.res.headers.has("Content-Length")) event.res.headers.set("Content-Length", asset.size.toString());
	return readAsset(id);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_dYR_68 = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_dYR_68
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
var globalMiddleware = [toEventHandler(static_default)].filter(Boolean);
//#endregion
//#region ../../node_modules/.pnpm/nitro@3.0.260311-beta_chokidar@5.0.0_idb-keyval@6.2.5_jiti@2.7.0_lru-cache@11.5.1_rollu_13dcb70debce3f1487324acdc59c4754/node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function createNitroApp() {
	const hooks = void 0;
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~middleware"].push(...globalMiddleware);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		{
			const routeRules = getRouteRules(method, pathname);
			event.context.routeRules = routeRules?.routeRules;
			if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		}
		middleware.push(...h3App["~middleware"]);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	for (const rule of Object.values(routeRules)) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region ../../node_modules/.pnpm/nitro@3.0.260311-beta_chokidar@5.0.0_idb-keyval@6.2.5_jiti@2.7.0_lru-cache@11.5.1_rollu_13dcb70debce3f1487324acdc59c4754/node_modules/nitro/dist/runtime/internal/error/hooks.mjs
function _captureError(error, type) {
	console.error(`[${type}]`, error);
	useNitroApp().captureError?.(error, { tags: [type] });
}
function trapUnhandledErrors() {
	process.on("unhandledRejection", (error) => _captureError(error, "unhandledRejection"));
	process.on("uncaughtException", (error) => _captureError(error, "uncaughtException"));
}
//#endregion
//#region ../../node_modules/.pnpm/nitro@3.0.260311-beta_chokidar@5.0.0_idb-keyval@6.2.5_jiti@2.7.0_lru-cache@11.5.1_rollu_13dcb70debce3f1487324acdc59c4754/node_modules/nitro/dist/presets/node/runtime/node-server.mjs
var _parsedPort = Number.parseInt(process.env.NITRO_PORT ?? process.env.PORT ?? "");
var port = Number.isNaN(_parsedPort) ? 3e3 : _parsedPort;
var host = process.env.NITRO_HOST || process.env.HOST;
var cert = process.env.NITRO_SSL_CERT;
var key = process.env.NITRO_SSL_KEY;
var nitroApp = useNitroApp();
serve({
	port,
	hostname: host,
	tls: cert && key ? {
		cert,
		key
	} : void 0,
	fetch: nitroApp.fetch
});
trapUnhandledErrors();
var node_server_default = {};
//#endregion
export { node_server_default as default };
