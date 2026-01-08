import { s as sanitize_props, a as spread_props, b as slot, g as ensure_array_like, d as attr, h as bind_props } from "./index2.js";
import { I as Icon } from "./Icon.js";
import { T as Trash_2 } from "./trash-2.js";
import { V as escape_html } from "./context.js";
function Arrow_left($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "m12 19-7-7 7-7" }],
    ["path", { "d": "M19 12H5" }]
  ];
  Icon($$renderer, spread_props([
    { name: "arrow-left" },
    $$sanitized_props,
    {
      /**
       * @component @name ArrowLeft
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTIgMTktNy03IDctNyIgLz4KICA8cGF0aCBkPSJNMTkgMTJINSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/arrow-left
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Chevron_down($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [["path", { "d": "m6 9 6 6 6-6" }]];
  Icon($$renderer, spread_props([
    { name: "chevron-down" },
    $$sanitized_props,
    {
      /**
       * @component @name ChevronDown
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtNiA5IDYgNiA2LTYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/chevron-down
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Chevron_up($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [["path", { "d": "m18 15-6-6-6 6" }]];
  Icon($$renderer, spread_props([
    { name: "chevron-up" },
    $$sanitized_props,
    {
      /**
       * @component @name ChevronUp
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTggMTUtNi02LTYgNiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/chevron-up
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function Save($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
      }
    ],
    ["path", { "d": "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" }],
    ["path", { "d": "M7 3v4a1 1 0 0 0 1 1h7" }]
  ];
  Icon($$renderer, spread_props([
    { name: "save" },
    $$sanitized_props,
    {
      /**
       * @component @name Save
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTUuMiAzYTIgMiAwIDAgMSAxLjQuNmwzLjggMy44YTIgMiAwIDAgMSAuNiAxLjRWMTlhMiAyIDAgMCAxLTIgMkg1YTIgMiAwIDAgMS0yLTJWNWEyIDIgMCAwIDEgMi0yeiIgLz4KICA8cGF0aCBkPSJNMTcgMjF2LTdhMSAxIDAgMCAwLTEtMUg4YTEgMSAwIDAgMC0xIDF2NyIgLz4KICA8cGF0aCBkPSJNNyAzdjRhMSAxIDAgMCAwIDEgMWg3IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/save
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      iconNode,
      children: ($$renderer2) => {
        $$renderer2.push(`<!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]-->`);
      },
      $$slots: { default: true }
    }
  ]));
}
function TransformationBuilder($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { transformations = void 0, ontransformationschange } = $$props;
    const transformationCategories = {
      Add: [
        { value: "add_prefix", label: "Add Prefix" },
        { value: "add_suffix", label: "Add Suffix" },
        { value: "wrap_code_block", label: "Wrap in Code Block" },
        { value: "number_lines", label: "Number Lines" },
        { value: "indent", label: "Indent" }
      ],
      Remove: [
        { value: "remove_blank_lines", label: "Remove Blank Lines" },
        { value: "trim_lines", label: "Trim Lines" },
        { value: "dedent", label: "Dedent" },
        { value: "remove_duplicates", label: "Remove Duplicates" }
      ],
      Replace: [{ value: "regex_replace", label: "Regex Replace" }],
      Transform: [
        { value: "to_uppercase", label: "To Uppercase" },
        { value: "to_lowercase", label: "To Lowercase" }
      ],
      Reorder: [
        { value: "sort_lines", label: "Sort Lines" },
        { value: "reverse_lines", label: "Reverse Lines" }
      ]
    };
    Object.values(transformationCategories).flat();
    let selectedTypeToAdd = "";
    function addTransformation(type) {
      const newTransformation = {
        id: `trans-${Date.now()}`,
        type,
        enabled: true,
        order: transformations.length + 1
      };
      transformations = [...transformations, newTransformation];
      ontransformationschange(transformations);
      selectedTypeToAdd = "";
    }
    function handleAddTransformationChange(e) {
      const select = e.target;
      const type = select.value;
      if (type) {
        addTransformation(type);
      }
    }
    function updateTransformation(id, updates) {
      transformations = transformations.map((t) => t.id === id ? { ...t, ...updates } : t);
      ontransformationschange(transformations);
    }
    $$renderer2.push(`<div class="space-y-4"><div><label for="add-transformation" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Add Transformation</label> `);
    $$renderer2.select(
      {
        id: "add-transformation",
        value: selectedTypeToAdd,
        onchange: handleAddTransformationChange,
        class: "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "" }, ($$renderer4) => {
          $$renderer4.push(`Select transformation type...`);
        });
        $$renderer3.push(`<!--[-->`);
        const each_array = ensure_array_like(Object.entries(transformationCategories));
        for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
          let [category, types] = each_array[$$index_1];
          $$renderer3.push(`<optgroup${attr("label", category)}><!--[-->`);
          const each_array_1 = ensure_array_like(types);
          for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
            let type = each_array_1[$$index];
            $$renderer3.option({ value: type.value }, ($$renderer4) => {
              $$renderer4.push(`${escape_html(type.label)}`);
            });
          }
          $$renderer3.push(`<!--]--></optgroup>`);
        }
        $$renderer3.push(`<!--]-->`);
      }
    );
    $$renderer2.push(`</div> `);
    if (transformations.length === 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="text-center py-8 text-gray-500 dark:text-gray-400">No transformations yet. Click "Add Transformation" to get started.</div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="space-y-3"><!--[-->`);
      const each_array_2 = ensure_array_like(transformations);
      for (let index = 0, $$length = each_array_2.length; index < $$length; index++) {
        let transformation = each_array_2[index];
        $$renderer2.push(`<div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"><div class="flex items-center gap-2 mb-3"><span class="text-sm font-medium text-gray-500 dark:text-gray-400 shrink-0">#${escape_html(index + 1)}</span> <input type="checkbox"${attr("checked", transformation.enabled, true)} class="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 shrink-0"/> `);
        $$renderer2.select(
          {
            value: transformation.type,
            onchange: (e) => updateTransformation(transformation.id, { type: e.target.value }),
            class: "flex-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
          },
          ($$renderer3) => {
            $$renderer3.push(`<!--[-->`);
            const each_array_3 = ensure_array_like(Object.entries(transformationCategories));
            for (let $$index_3 = 0, $$length2 = each_array_3.length; $$index_3 < $$length2; $$index_3++) {
              let [category, types] = each_array_3[$$index_3];
              $$renderer3.push(`<optgroup${attr("label", category)}><!--[-->`);
              const each_array_4 = ensure_array_like(types);
              for (let $$index_2 = 0, $$length3 = each_array_4.length; $$index_2 < $$length3; $$index_2++) {
                let type = each_array_4[$$index_2];
                $$renderer3.option({ value: type.value }, ($$renderer4) => {
                  $$renderer4.push(`${escape_html(type.label)}`);
                });
              }
              $$renderer3.push(`<!--]--></optgroup>`);
            }
            $$renderer3.push(`<!--]-->`);
          }
        );
        $$renderer2.push(` <div class="flex items-center gap-1 shrink-0"><button${attr("disabled", index === 0, true)} class="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30" title="Move up">`);
        Chevron_up($$renderer2, { size: 18 });
        $$renderer2.push(`<!----></button> <button${attr("disabled", index === transformations.length - 1, true)} class="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30" title="Move down">`);
        Chevron_down($$renderer2, { size: 18 });
        $$renderer2.push(`<!----></button> <button class="p-1 text-red-400 dark:text-red-500 hover:text-red-600 dark:hover:text-red-400" title="Delete">`);
        Trash_2($$renderer2, { size: 18 });
        $$renderer2.push(`<!----></button></div></div> `);
        if (transformation.type === "wrap_code_block" || transformation.type === "add_prefix" || transformation.type === "add_suffix") {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">${escape_html(transformation.type === "wrap_code_block" ? "Language (optional)" : transformation.type === "add_prefix" ? "Prefix Text" : "Suffix Text")}</label> <input type="text"${attr("value", "value" in transformation && transformation.value || "")}${attr("placeholder", transformation.type === "wrap_code_block" ? "e.g., javascript" : "")} class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"/></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
          if (transformation.type === "regex_replace") {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<div class="space-y-2"><div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pattern</label> <input type="text"${attr("value", "pattern" in transformation && transformation.pattern || "")} placeholder="e.g., \\n\\n+" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 font-mono text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"/></div> <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Replacement</label> <input type="text"${attr("value", "replacement" in transformation && transformation.replacement || "")} placeholder="e.g., \\n" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 font-mono text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"/></div> <div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Flags</label> <input type="text"${attr("value", "flags" in transformation && transformation.flags || "g")} placeholder="g, gi, gm, etc." class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"/></div></div>`);
          } else {
            $$renderer2.push("<!--[!-->");
            if (transformation.type === "number_lines" || transformation.type === "indent" || transformation.type === "dedent") {
              $$renderer2.push("<!--[-->");
              $$renderer2.push(`<div><label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">${escape_html(transformation.type === "number_lines" ? "Start From" : transformation.type === "indent" ? "Spaces to Add" : "Spaces to Remove")}</label> <input type="number"${attr("value", "value" in transformation && transformation.value || 1)} min="1" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"/></div>`);
            } else {
              $$renderer2.push("<!--[!-->");
            }
            $$renderer2.push(`<!--]-->`);
          }
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]--></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { transformations });
  });
}
export {
  Arrow_left as A,
  Save as S,
  TransformationBuilder as T
};
