//#region ../../node_modules/.pnpm/openapi-fetch@0.13.8/node_modules/openapi-fetch/dist/index.js
var PATH_PARAM_RE = /\{[^{}]+\}/g;
var supportsRequestInitExt = () => {
	return typeof process === "object" && Number.parseInt(process?.versions?.node?.substring(0, 2)) >= 18 && process.versions.undici;
};
/**
* Returns a cheap, non-cryptographically-secure random ID
* Courtesy of @imranbarbhuiya (https://github.com/imranbarbhuiya)
*/
function randomID() {
	return Math.random().toString(36).slice(2, 11);
}
/**
* Create an openapi-fetch client.
* @type {import("./index.js").default}
*/
function createClient(clientOptions) {
	let { baseUrl = "", Request: CustomRequest = globalThis.Request, fetch: baseFetch = globalThis.fetch, querySerializer: globalQuerySerializer, bodySerializer: globalBodySerializer, headers: baseHeaders, requestInitExt = void 0, ...baseOptions } = { ...clientOptions };
	requestInitExt = supportsRequestInitExt() ? requestInitExt : void 0;
	baseUrl = removeTrailingSlash(baseUrl);
	const middlewares = [];
	/**
	* Per-request fetch (keeps settings created in createClient()
	* @param {T} url
	* @param {import('./index.js').FetchOptions<T>} fetchOptions
	*/
	async function coreFetch(schemaPath, fetchOptions) {
		const { baseUrl: localBaseUrl, fetch = baseFetch, Request = CustomRequest, headers, params = {}, parseAs = "json", querySerializer: requestQuerySerializer, bodySerializer = globalBodySerializer ?? defaultBodySerializer, body, ...init } = fetchOptions || {};
		let finalBaseUrl = baseUrl;
		if (localBaseUrl) finalBaseUrl = removeTrailingSlash(localBaseUrl) ?? baseUrl;
		let querySerializer = typeof globalQuerySerializer === "function" ? globalQuerySerializer : createQuerySerializer(globalQuerySerializer);
		if (requestQuerySerializer) querySerializer = typeof requestQuerySerializer === "function" ? requestQuerySerializer : createQuerySerializer({
			...typeof globalQuerySerializer === "object" ? globalQuerySerializer : {},
			...requestQuerySerializer
		});
		const serializedBody = body === void 0 ? void 0 : bodySerializer(body, mergeHeaders(baseHeaders, headers, params.header));
		const finalHeaders = mergeHeaders(serializedBody === void 0 || serializedBody instanceof FormData ? {} : { "Content-Type": "application/json" }, baseHeaders, headers, params.header);
		const requestInit = {
			redirect: "follow",
			...baseOptions,
			...init,
			body: serializedBody,
			headers: finalHeaders
		};
		let id;
		let options;
		let request = new CustomRequest(createFinalURL(schemaPath, {
			baseUrl: finalBaseUrl,
			params,
			querySerializer
		}), requestInit);
		let response;
		/** Add custom parameters to Request object */
		for (const key in init) if (!(key in request)) request[key] = init[key];
		if (middlewares.length) {
			id = randomID();
			options = Object.freeze({
				baseUrl: finalBaseUrl,
				fetch,
				parseAs,
				querySerializer,
				bodySerializer
			});
			for (const m of middlewares) if (m && typeof m === "object" && typeof m.onRequest === "function") {
				const result = await m.onRequest({
					request,
					schemaPath,
					params,
					options,
					id
				});
				if (result) if (result instanceof CustomRequest) request = result;
				else if (result instanceof Response) {
					response = result;
					break;
				} else throw new Error("onRequest: must return new Request() or Response() when modifying the request");
			}
		}
		if (!response) {
			try {
				response = await fetch(request, requestInitExt);
			} catch (error) {
				let errorAfterMiddleware = error;
				if (middlewares.length) for (let i = middlewares.length - 1; i >= 0; i--) {
					const m = middlewares[i];
					if (m && typeof m === "object" && typeof m.onError === "function") {
						const result = await m.onError({
							request,
							error: errorAfterMiddleware,
							schemaPath,
							params,
							options,
							id
						});
						if (result) {
							if (result instanceof Response) {
								errorAfterMiddleware = void 0;
								response = result;
								break;
							}
							if (result instanceof Error) {
								errorAfterMiddleware = result;
								continue;
							}
							throw new Error("onError: must return new Response() or instance of Error");
						}
					}
				}
				if (errorAfterMiddleware) throw errorAfterMiddleware;
			}
			if (middlewares.length) for (let i = middlewares.length - 1; i >= 0; i--) {
				const m = middlewares[i];
				if (m && typeof m === "object" && typeof m.onResponse === "function") {
					const result = await m.onResponse({
						request,
						response,
						schemaPath,
						params,
						options,
						id
					});
					if (result) {
						if (!(result instanceof Response)) throw new Error("onResponse: must return new Response() when modifying the response");
						response = result;
					}
				}
			}
		}
		if (response.status === 204 || request.method === "HEAD" || response.headers.get("Content-Length") === "0") return response.ok ? {
			data: void 0,
			response
		} : {
			error: void 0,
			response
		};
		if (response.ok) {
			if (parseAs === "stream") return {
				data: response.body,
				response
			};
			return {
				data: await response[parseAs](),
				response
			};
		}
		let error = await response.text();
		try {
			error = JSON.parse(error);
		} catch {}
		return {
			error,
			response
		};
	}
	return {
		request(method, url, init) {
			return coreFetch(url, {
				...init,
				method: method.toUpperCase()
			});
		},
		/** Call a GET endpoint */
		GET(url, init) {
			return coreFetch(url, {
				...init,
				method: "GET"
			});
		},
		/** Call a PUT endpoint */
		PUT(url, init) {
			return coreFetch(url, {
				...init,
				method: "PUT"
			});
		},
		/** Call a POST endpoint */
		POST(url, init) {
			return coreFetch(url, {
				...init,
				method: "POST"
			});
		},
		/** Call a DELETE endpoint */
		DELETE(url, init) {
			return coreFetch(url, {
				...init,
				method: "DELETE"
			});
		},
		/** Call a OPTIONS endpoint */
		OPTIONS(url, init) {
			return coreFetch(url, {
				...init,
				method: "OPTIONS"
			});
		},
		/** Call a HEAD endpoint */
		HEAD(url, init) {
			return coreFetch(url, {
				...init,
				method: "HEAD"
			});
		},
		/** Call a PATCH endpoint */
		PATCH(url, init) {
			return coreFetch(url, {
				...init,
				method: "PATCH"
			});
		},
		/** Call a TRACE endpoint */
		TRACE(url, init) {
			return coreFetch(url, {
				...init,
				method: "TRACE"
			});
		},
		/** Register middleware */
		use(...middleware) {
			for (const m of middleware) {
				if (!m) continue;
				if (typeof m !== "object" || !("onRequest" in m || "onResponse" in m || "onError" in m)) throw new Error("Middleware must be an object with one of `onRequest()`, `onResponse() or `onError()`");
				middlewares.push(m);
			}
		},
		/** Unregister middleware */
		eject(...middleware) {
			for (const m of middleware) {
				const i = middlewares.indexOf(m);
				if (i !== -1) middlewares.splice(i, 1);
			}
		}
	};
}
/**
* Serialize primitive param values
* @type {import("./index.js").serializePrimitiveParam}
*/
function serializePrimitiveParam(name, value, options) {
	if (value === void 0 || value === null) return "";
	if (typeof value === "object") throw new Error("Deeply-nested arrays/objects aren’t supported. Provide your own `querySerializer()` to handle these.");
	return `${name}=${options?.allowReserved === true ? value : encodeURIComponent(value)}`;
}
/**
* Serialize object param (shallow only)
* @type {import("./index.js").serializeObjectParam}
*/
function serializeObjectParam(name, value, options) {
	if (!value || typeof value !== "object") return "";
	const values = [];
	const joiner = {
		simple: ",",
		label: ".",
		matrix: ";"
	}[options.style] || "&";
	if (options.style !== "deepObject" && options.explode === false) {
		for (const k in value) values.push(k, options.allowReserved === true ? value[k] : encodeURIComponent(value[k]));
		const final = values.join(",");
		switch (options.style) {
			case "form": return `${name}=${final}`;
			case "label": return `.${final}`;
			case "matrix": return `;${name}=${final}`;
			default: return final;
		}
	}
	for (const k in value) {
		const finalName = options.style === "deepObject" ? `${name}[${k}]` : k;
		values.push(serializePrimitiveParam(finalName, value[k], options));
	}
	const final = values.join(joiner);
	return options.style === "label" || options.style === "matrix" ? `${joiner}${final}` : final;
}
/**
* Serialize array param (shallow only)
* @type {import("./index.js").serializeArrayParam}
*/
function serializeArrayParam(name, value, options) {
	if (!Array.isArray(value)) return "";
	if (options.explode === false) {
		const joiner = {
			form: ",",
			spaceDelimited: "%20",
			pipeDelimited: "|"
		}[options.style] || ",";
		const final = (options.allowReserved === true ? value : value.map((v) => encodeURIComponent(v))).join(joiner);
		switch (options.style) {
			case "simple": return final;
			case "label": return `.${final}`;
			case "matrix": return `;${name}=${final}`;
			default: return `${name}=${final}`;
		}
	}
	const joiner = {
		simple: ",",
		label: ".",
		matrix: ";"
	}[options.style] || "&";
	const values = [];
	for (const v of value) if (options.style === "simple" || options.style === "label") values.push(options.allowReserved === true ? v : encodeURIComponent(v));
	else values.push(serializePrimitiveParam(name, v, options));
	return options.style === "label" || options.style === "matrix" ? `${joiner}${values.join(joiner)}` : values.join(joiner);
}
/**
* Serialize query params to string
* @type {import("./index.js").createQuerySerializer}
*/
function createQuerySerializer(options) {
	return function querySerializer(queryParams) {
		const search = [];
		if (queryParams && typeof queryParams === "object") for (const name in queryParams) {
			const value = queryParams[name];
			if (value === void 0 || value === null) continue;
			if (Array.isArray(value)) {
				if (value.length === 0) continue;
				search.push(serializeArrayParam(name, value, {
					style: "form",
					explode: true,
					...options?.array,
					allowReserved: options?.allowReserved || false
				}));
				continue;
			}
			if (typeof value === "object") {
				search.push(serializeObjectParam(name, value, {
					style: "deepObject",
					explode: true,
					...options?.object,
					allowReserved: options?.allowReserved || false
				}));
				continue;
			}
			search.push(serializePrimitiveParam(name, value, options));
		}
		return search.join("&");
	};
}
/**
* Handle different OpenAPI 3.x serialization styles
* @type {import("./index.js").defaultPathSerializer}
* @see https://swagger.io/docs/specification/serialization/#path
*/
function defaultPathSerializer(pathname, pathParams) {
	let nextURL = pathname;
	for (const match of pathname.match(PATH_PARAM_RE) ?? []) {
		let name = match.substring(1, match.length - 1);
		let explode = false;
		let style = "simple";
		if (name.endsWith("*")) {
			explode = true;
			name = name.substring(0, name.length - 1);
		}
		if (name.startsWith(".")) {
			style = "label";
			name = name.substring(1);
		} else if (name.startsWith(";")) {
			style = "matrix";
			name = name.substring(1);
		}
		if (!pathParams || pathParams[name] === void 0 || pathParams[name] === null) continue;
		const value = pathParams[name];
		if (Array.isArray(value)) {
			nextURL = nextURL.replace(match, serializeArrayParam(name, value, {
				style,
				explode
			}));
			continue;
		}
		if (typeof value === "object") {
			nextURL = nextURL.replace(match, serializeObjectParam(name, value, {
				style,
				explode
			}));
			continue;
		}
		if (style === "matrix") {
			nextURL = nextURL.replace(match, `;${serializePrimitiveParam(name, value)}`);
			continue;
		}
		nextURL = nextURL.replace(match, style === "label" ? `.${encodeURIComponent(value)}` : encodeURIComponent(value));
	}
	return nextURL;
}
/**
* Serialize body object to string
* @type {import("./index.js").defaultBodySerializer}
*/
function defaultBodySerializer(body, headers) {
	if (body instanceof FormData) return body;
	if (headers) {
		if ((headers.get instanceof Function ? headers.get("Content-Type") ?? headers.get("content-type") : headers["Content-Type"] ?? headers["content-type"]) === "application/x-www-form-urlencoded") return new URLSearchParams(body).toString();
	}
	return JSON.stringify(body);
}
/**
* Construct URL string from baseUrl and handle path and query params
* @type {import("./index.js").createFinalURL}
*/
function createFinalURL(pathname, options) {
	let finalURL = `${options.baseUrl}${pathname}`;
	if (options.params?.path) finalURL = defaultPathSerializer(finalURL, options.params.path);
	let search = options.querySerializer(options.params.query ?? {});
	if (search.startsWith("?")) search = search.substring(1);
	if (search) finalURL += `?${search}`;
	return finalURL;
}
/**
* Merge headers a and b, with b taking priority
* @type {import("./index.js").mergeHeaders}
*/
function mergeHeaders(...allHeaders) {
	const finalHeaders = new Headers();
	for (const h of allHeaders) {
		if (!h || typeof h !== "object") continue;
		const iterator = h instanceof Headers ? h.entries() : Object.entries(h);
		for (const [k, v] of iterator) if (v === null) finalHeaders.delete(k);
		else if (Array.isArray(v)) for (const v2 of v) finalHeaders.append(k, v2);
		else if (v !== void 0) finalHeaders.set(k, v);
	}
	return finalHeaders;
}
/**
* Remove trailing slash from url
* @type {import("./index.js").removeTrailingSlash}
*/
function removeTrailingSlash(url) {
	if (url.endsWith("/")) return url.substring(0, url.length - 1);
	return url;
}
//#endregion
//#region ../../node_modules/.pnpm/@metamask+analytics@0.4.0/node_modules/@metamask/analytics/dist/index.mjs
var Sender = class {
	sendFn;
	batch = [];
	batchSize;
	baseTimeoutMs;
	currentTimeoutMs;
	maxTimeoutMs = 3e4;
	timeoutId = null;
	isSending = false;
	constructor(options) {
		this.batchSize = options.batchSize;
		this.baseTimeoutMs = options.baseTimeoutMs;
		this.currentTimeoutMs = options.baseTimeoutMs;
		this.sendFn = options.sendFn;
	}
	enqueue(item) {
		this.batch.push(item);
		this.schedule();
	}
	schedule() {
		if (this.batch.length > 0 && !this.timeoutId) this.timeoutId = setTimeout(() => {
			this.timeoutId = null;
			this.flush();
		}, this.currentTimeoutMs);
	}
	async flush() {
		if (this.isSending || this.batch.length === 0) return;
		this.isSending = true;
		const current = [...this.batch.slice(0, this.batchSize)];
		this.batch = this.batch.slice(this.batchSize);
		try {
			await this.sendFn(current);
			this.currentTimeoutMs = this.baseTimeoutMs;
		} catch (error) {
			console.error("Sender: Failed to send batch", error);
			this.batch = [...current, ...this.batch];
			this.currentTimeoutMs = Math.min(this.currentTimeoutMs * 2, this.maxTimeoutMs);
		} finally {
			this.isSending = false;
			this.schedule();
		}
	}
};
var sender_default = Sender;
var Analytics = class {
	enabled = false;
	sender;
	properties = {};
	constructor(baseUrl) {
		const client2 = createClient({ baseUrl });
		const sendFn = async (batch) => {
			const res = await client2.POST("/v2/events", { body: batch });
			if (res.response.status !== 200) throw new Error(res.error);
		};
		this.sender = new sender_default({
			batchSize: 100,
			baseTimeoutMs: 200,
			sendFn
		});
	}
	enable() {
		this.enabled = true;
	}
	setGlobalProperty(key, value) {
		if (key === "integration_types") {
			const existing = Array.isArray(this.properties.integration_types) ? this.properties.integration_types : [];
			const incoming = Array.isArray(value) ? value : [];
			this.properties.integration_types = [.../* @__PURE__ */ new Set([...existing, ...incoming])];
			return;
		}
		this.properties[key] = value;
	}
	track(eventName, properties) {
		if (!this.enabled) return;
		const event = {
			namespace: "metamask/connect",
			event_name: eventName,
			properties: {
				...properties,
				...this.properties
			}
		};
		this.sender.enqueue(event);
	}
};
var analytics_default = Analytics;
var endpoint;
if (typeof process !== "undefined" && process.env) endpoint = process.env.METAMASK_ANALYTICS_ENDPOINT ?? process.env.NEXT_PUBLIC_METAMASK_ANALYTICS_ENDPOINT;
var analytics = new analytics_default(endpoint ?? "https://mm-sdk-analytics.api.cx.metamask.io/");
//#endregion
export { analytics as t };
