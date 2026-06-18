import { n as HTTPError, o as toRequest } from "../_libs/h3+rou3+srvx.mjs";
//#region ../../node_modules/.pnpm/nitro@3.0.260311-beta_chokidar@5.0.0_idb-keyval@6.2.5_jiti@2.7.0_lru-cache@11.5.1_rollu_13dcb70debce3f1487324acdc59c4754/node_modules/nitro/dist/runtime/vite.mjs
function fetchViteEnv(viteEnvName, input, init) {
	const viteEnv = (globalThis.__nitro_vite_envs__ || {})[viteEnvName];
	if (!viteEnv) throw HTTPError.status(404);
	return Promise.resolve(viteEnv.fetch(toRequest(input, init)));
}
//#endregion
//#region ../../node_modules/.pnpm/nitro@3.0.260311-beta_chokidar@5.0.0_idb-keyval@6.2.5_jiti@2.7.0_lru-cache@11.5.1_rollu_13dcb70debce3f1487324acdc59c4754/node_modules/nitro/dist/runtime/internal/vite/ssr-renderer.mjs
/** @param {{ req: Request }} HTTPEvent */
function ssrRenderer({ req }) {
	return fetchViteEnv("ssr", req);
}
//#endregion
export { ssrRenderer as default };
