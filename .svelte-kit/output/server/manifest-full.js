export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {start:"_app/immutable/entry/start.Bl5q8TDM.js",app:"_app/immutable/entry/app.DrQkp2rs.js",imports:["_app/immutable/entry/start.Bl5q8TDM.js","_app/immutable/chunks/C2HQg65W.js","_app/immutable/chunks/BjbBlfYJ.js","_app/immutable/chunks/B2Vnf32q.js","_app/immutable/entry/app.DrQkp2rs.js","_app/immutable/chunks/BjbBlfYJ.js","_app/immutable/chunks/DArtHkHk.js","_app/immutable/chunks/B2Vnf32q.js","_app/immutable/chunks/DL2-Z6ex.js","_app/immutable/chunks/CoaWwRG8.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/templates",
				pattern: /^\/templates\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/templates/new",
				pattern: /^\/templates\/new\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/templates/[id]",
				pattern: /^\/templates\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
