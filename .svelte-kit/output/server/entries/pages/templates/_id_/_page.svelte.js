import { c as store_get, u as unsubscribe_stores, d as attr } from "../../../../chunks/index2.js";
import { p as page } from "../../../../chunks/stores.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/state.svelte.js";
import "../../../../chunks/templateStore.js";
import "../../../../chunks/Icon.js";
import "diff-match-patch";
import { A as Arrow_left, S as Save, T as TransformationBuilder } from "../../../../chunks/TransformationBuilder.js";
import { T as Trash_2 } from "../../../../chunks/trash-2.js";
import { V as escape_html } from "../../../../chunks/context.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    store_get($$store_subs ??= {}, "$page", page).params.id;
    let name = "";
    let description = "";
    let category = "General";
    let tagsInput = "";
    let exampleText = "";
    let transformations = [];
    let sampleInput = "";
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      $$renderer3.push(`<div class="max-w-7xl mx-auto"><div class="flex items-center justify-between mb-6"><div class="flex items-center gap-4"><button class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100" aria-label="Go back">`);
      Arrow_left($$renderer3, { size: 24 });
      $$renderer3.push(`<!----></button> <div><h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">Edit Template</h1> <p class="text-gray-600 dark:text-gray-400 mt-1">Modify transformations and test with live preview</p></div></div> <div class="flex items-center gap-2"><button class="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium">`);
      Trash_2($$renderer3, { size: 18 });
      $$renderer3.push(`<!----> Delete</button> <button class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">`);
      Save($$renderer3, { size: 18 });
      $$renderer3.push(`<!----> Save Changes</button></div></div> <div class="grid grid-cols-1 lg:grid-cols-2 gap-6"><div class="space-y-6"><div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"><h2 class="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Template Information</h2> <div class="space-y-4"><div><label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name <span class="text-red-500">*</span></label> <input id="name" type="text"${attr("value", name)} placeholder="e.g., Format Grafana Errors" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" required/></div> <div><label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label> <textarea id="description" placeholder="Brief description of what this template does..." rows="2" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">`);
      const $$body = escape_html(description);
      if ($$body) {
        $$renderer3.push(`${$$body}`);
      }
      $$renderer3.push(`</textarea></div> <div><label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label> <input id="category" type="text"${attr("value", category)} placeholder="e.g., Logging, Markdown" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"/></div> <div><label for="tags" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags (comma-separated)</label> <input id="tags" type="text"${attr("value", tagsInput)} placeholder="e.g., grafana, errors, logs" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"/></div> <div><label for="exampleText" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preview Example Text</label> <textarea id="exampleText" placeholder="e.g., lorem ipsum  dolor sit amet" rows="3" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-sm">`);
      const $$body_1 = escape_html(exampleText);
      if ($$body_1) {
        $$renderer3.push(`${$$body_1}`);
      }
      $$renderer3.push(`</textarea> <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">This text will be shown in the hover preview on the main page</p></div></div></div> <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"><h2 class="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Transformations</h2> `);
      TransformationBuilder($$renderer3, {
        ontransformationschange: (t) => transformations = t,
        get transformations() {
          return transformations;
        },
        set transformations($$value) {
          transformations = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----></div></div> <div class="space-y-6"><div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"><h2 class="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Test with Sample Text</h2> <textarea placeholder="Paste sample text here to see live preview..." rows="10" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-sm">`);
      const $$body_2 = escape_html(sampleInput);
      if ($$body_2) {
        $$renderer3.push(`${$$body_2}`);
      }
      $$renderer3.push(`</textarea></div> `);
      {
        $$renderer3.push("<!--[!-->");
      }
      $$renderer3.push(`<!--]--></div></div></div>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
