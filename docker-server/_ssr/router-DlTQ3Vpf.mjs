import { l as lazyRouteComponent, s as createRouter, u as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { U as require_jsx_runtime } from "../_libs/@dynamic-labs/sdk-react-core+[...].mjs";
import { i as Route$5, n as NotFound, t as DefaultCatchBoundary } from "../__root-BuMiPQ8f.mjs";
import { t as Route$6 } from "./vault._id-BAFY8-lG.mjs";
import { t as Route$7 } from "./vault._id.policy-DvOmSp3x.mjs";
import { t as Route$8 } from "./vault._id.activity-Caihp8me.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-DlTQ3Vpf.js
var import_jsx_runtime = require_jsx_runtime();
var $$splitComponentImporter$4 = () => import("./docs-N8ldwYPf.mjs");
var Route$4 = createFileRoute("/docs")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./route-kbaugDJw.mjs");
var Route$3 = createFileRoute("/app")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./routes-Bf2BI_NY.mjs");
var Route$2 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./app-C_xDG2FE.mjs");
var Route$1 = createFileRoute("/app/")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./create-BMyMDF4S.mjs");
var Route = createFileRoute("/app/create")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var DocsRoute = Route$4.update({
	id: "/docs",
	path: "/docs",
	getParentRoute: () => Route$5
});
var AppRouteRoute = Route$3.update({
	id: "/app",
	path: "/app",
	getParentRoute: () => Route$5
});
var IndexRoute = Route$2.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$5
});
var AppIndexRoute = Route$1.update({
	id: "/",
	path: "/",
	getParentRoute: () => AppRouteRoute
});
var AppCreateRoute = Route.update({
	id: "/create",
	path: "/create",
	getParentRoute: () => AppRouteRoute
});
var AppVaultIdRoute = Route$6.update({
	id: "/vault/$id",
	path: "/vault/$id",
	getParentRoute: () => AppRouteRoute
});
var AppVaultIdPolicyRoute = Route$7.update({
	id: "/policy",
	path: "/policy",
	getParentRoute: () => AppVaultIdRoute
});
var AppVaultIdRouteChildren = {
	AppVaultIdActivityRoute: Route$8.update({
		id: "/activity",
		path: "/activity",
		getParentRoute: () => AppVaultIdRoute
	}),
	AppVaultIdPolicyRoute
};
var AppRouteRouteChildren = {
	AppCreateRoute,
	AppIndexRoute,
	AppVaultIdRoute: AppVaultIdRoute._addFileChildren(AppVaultIdRouteChildren)
};
var rootRouteChildren = {
	IndexRoute,
	AppRouteRoute: AppRouteRoute._addFileChildren(AppRouteRouteChildren),
	DocsRoute
};
var routeTree = Route$5._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
	return createRouter({
		routeTree,
		defaultPreload: "intent",
		defaultErrorComponent: DefaultCatchBoundary,
		defaultNotFoundComponent: () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotFound, {}),
		scrollRestoration: true
	});
}
//#endregion
export { getRouter };
