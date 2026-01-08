

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/templates/_id_/_page.svelte.js')).default;
export const universal = {
  "ssr": false,
  "prerender": false
};
export const universal_id = "src/routes/templates/[id]/+page.ts";
export const imports = ["_app/immutable/nodes/4.BITTsmTo.js","_app/immutable/chunks/DArtHkHk.js","_app/immutable/chunks/BjbBlfYJ.js","_app/immutable/chunks/B2Vnf32q.js","_app/immutable/chunks/DL2-Z6ex.js","_app/immutable/chunks/LlG9SSuv.js","_app/immutable/chunks/E4fo9bj-.js","_app/immutable/chunks/zHiRsLaD.js","_app/immutable/chunks/C6Z-BH3f.js","_app/immutable/chunks/C2HQg65W.js","_app/immutable/chunks/DRZLMWTu.js","_app/immutable/chunks/DAaTc6sE.js","_app/immutable/chunks/BzmJ6XsI.js"];
export const stylesheets = [];
export const fonts = [];
