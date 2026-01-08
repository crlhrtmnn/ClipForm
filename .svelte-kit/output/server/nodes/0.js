

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const universal = {
  "ssr": false,
  "prerender": true
};
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.Bm7DsO_G.js","_app/immutable/chunks/DArtHkHk.js","_app/immutable/chunks/BjbBlfYJ.js","_app/immutable/chunks/B2Vnf32q.js","_app/immutable/chunks/DL2-Z6ex.js","_app/immutable/chunks/LlG9SSuv.js","_app/immutable/chunks/E4fo9bj-.js","_app/immutable/chunks/CEA3JsIK.js","_app/immutable/chunks/C6Z-BH3f.js","_app/immutable/chunks/C2HQg65W.js","_app/immutable/chunks/CoaWwRG8.js"];
export const stylesheets = ["_app/immutable/assets/0.BH17h56M.css"];
export const fonts = [];
