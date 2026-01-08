import { s as sanitize_props, a as spread_props, b as slot, d as attr, c as store_get, g as ensure_array_like, u as unsubscribe_stores } from "../../chunks/index2.js";
import { t as templateStore, s as starredTemplates } from "../../chunks/templateStore.js";
import { I as Icon } from "../../chunks/Icon.js";
import { V as escape_html } from "../../chunks/context.js";
import "clsx";
function Code($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "m16 18 6-6-6-6" }],
    ["path", { "d": "m8 6-6 6 6 6" }]
  ];
  Icon($$renderer, spread_props([
    { name: "code" },
    $$sanitized_props,
    {
      /**
       * @component @name Code
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTYgMTggNi02LTYtNiIgLz4KICA8cGF0aCBkPSJtOCA2LTYgNiA2IDYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/code
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
function Command($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"
      }
    ]
  ];
  Icon($$renderer, spread_props([
    { name: "command" },
    $$sanitized_props,
    {
      /**
       * @component @name Command
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTUgNnYxMmEzIDMgMCAxIDAgMy0zSDZhMyAzIDAgMSAwIDMgM1Y2YTMgMyAwIDEgMC0zIDNoMTJhMyAzIDAgMSAwLTMtMyIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/command
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
function File_text($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    [
      "path",
      {
        "d": "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"
      }
    ],
    ["path", { "d": "M14 2v5a1 1 0 0 0 1 1h5" }],
    ["path", { "d": "M10 9H8" }],
    ["path", { "d": "M16 13H8" }],
    ["path", { "d": "M16 17H8" }]
  ];
  Icon($$renderer, spread_props([
    { name: "file-text" },
    $$sanitized_props,
    {
      /**
       * @component @name FileText
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNiAyMmEyIDIgMCAwIDEtMi0yVjRhMiAyIDAgMCAxIDItMmg4YTIuNCAyLjQgMCAwIDEgMS43MDQuNzA2bDMuNTg4IDMuNTg4QTIuNCAyLjQgMCAwIDEgMjAgOHYxMmEyIDIgMCAwIDEtMiAyeiIgLz4KICA8cGF0aCBkPSJNMTQgMnY1YTEgMSAwIDAgMCAxIDFoNSIgLz4KICA8cGF0aCBkPSJNMTAgOUg4IiAvPgogIDxwYXRoIGQ9Ik0xNiAxM0g4IiAvPgogIDxwYXRoIGQ9Ik0xNiAxN0g4IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/file-text
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
function Hash($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["line", { "x1": "4", "x2": "20", "y1": "9", "y2": "9" }],
    ["line", { "x1": "4", "x2": "20", "y1": "15", "y2": "15" }],
    ["line", { "x1": "10", "x2": "8", "y1": "3", "y2": "21" }],
    ["line", { "x1": "16", "x2": "14", "y1": "3", "y2": "21" }]
  ];
  Icon($$renderer, spread_props([
    { name: "hash" },
    $$sanitized_props,
    {
      /**
       * @component @name Hash
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8bGluZSB4MT0iNCIgeDI9IjIwIiB5MT0iOSIgeTI9IjkiIC8+CiAgPGxpbmUgeDE9IjQiIHgyPSIyMCIgeTE9IjE1IiB5Mj0iMTUiIC8+CiAgPGxpbmUgeDE9IjEwIiB4Mj0iOCIgeTE9IjMiIHkyPSIyMSIgLz4KICA8bGluZSB4MT0iMTYiIHgyPSIxNCIgeTE9IjMiIHkyPSIyMSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/hash
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
function List($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "M3 5h.01" }],
    ["path", { "d": "M3 12h.01" }],
    ["path", { "d": "M3 19h.01" }],
    ["path", { "d": "M8 5h13" }],
    ["path", { "d": "M8 12h13" }],
    ["path", { "d": "M8 19h13" }]
  ];
  Icon($$renderer, spread_props([
    { name: "list" },
    $$sanitized_props,
    {
      /**
       * @component @name List
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMyA1aC4wMSIgLz4KICA8cGF0aCBkPSJNMyAxMmguMDEiIC8+CiAgPHBhdGggZD0iTTMgMTloLjAxIiAvPgogIDxwYXRoIGQ9Ik04IDVoMTMiIC8+CiAgPHBhdGggZD0iTTggMTJoMTMiIC8+CiAgPHBhdGggZD0iTTggMTloMTMiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/list
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
function Scissors($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["circle", { "cx": "6", "cy": "6", "r": "3" }],
    ["path", { "d": "M8.12 8.12 12 12" }],
    ["path", { "d": "M20 4 8.12 15.88" }],
    ["circle", { "cx": "6", "cy": "18", "r": "3" }],
    ["path", { "d": "M14.8 14.8 20 20" }]
  ];
  Icon($$renderer, spread_props([
    { name: "scissors" },
    $$sanitized_props,
    {
      /**
       * @component @name Scissors
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSI2IiBjeT0iNiIgcj0iMyIgLz4KICA8cGF0aCBkPSJNOC4xMiA4LjEyIDEyIDEyIiAvPgogIDxwYXRoIGQ9Ik0yMCA0IDguMTIgMTUuODgiIC8+CiAgPGNpcmNsZSBjeD0iNiIgY3k9IjE4IiByPSIzIiAvPgogIDxwYXRoIGQ9Ik0xNC44IDE0LjggMjAgMjAiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/scissors
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
function Type($$renderer, $$props) {
  const $$sanitized_props = sanitize_props($$props);
  const iconNode = [
    ["path", { "d": "M12 4v16" }],
    ["path", { "d": "M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2" }],
    ["path", { "d": "M9 20h6" }]
  ];
  Icon($$renderer, spread_props([
    { name: "type" },
    $$sanitized_props,
    {
      /**
       * @component @name Type
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgNHYxNiIgLz4KICA8cGF0aCBkPSJNNCA3VjVhMSAxIDAgMCAxIDEtMWgxNGExIDEgMCAwIDEgMSAxdjIiIC8+CiAgPHBhdGggZD0iTTkgMjBoNiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/type
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
function removeBlankLines(text) {
  return text.split("\n").filter((line) => line.trim() !== "").join("\n");
}
function trimLines(text) {
  return text.split("\n").map((line) => line.trim()).join("\n");
}
function toUpperCase(text) {
  return text.toUpperCase();
}
function toLowerCase(text) {
  return text.toLowerCase();
}
function removeDuplicates(text) {
  const lines = text.split("\n");
  const seen = /* @__PURE__ */ new Set();
  const result = [];
  for (const line of lines) {
    if (!seen.has(line)) {
      seen.add(line);
      result.push(line);
    }
  }
  return result.join("\n");
}
function sortLines(text) {
  return text.split("\n").sort().join("\n");
}
function reverseLines(text) {
  return text.split("\n").reverse().join("\n");
}
function wrapCodeBlock(text, language = "") {
  return `\`\`\`${language}
${text}
\`\`\``;
}
function addPrefix(text, prefix) {
  return text.split("\n").map((line) => `${prefix}${line}`).join("\n");
}
function addSuffix(text, suffix) {
  return text.split("\n").map((line) => `${line}${suffix}`).join("\n");
}
function regexReplace(text, pattern, replacement, flags) {
  try {
    const regex = new RegExp(pattern, flags);
    return text.replace(regex, replacement);
  } catch (error) {
    throw new Error(`Invalid regex pattern: ${pattern}`);
  }
}
function numberLines(text, startFrom = 1) {
  const lines = text.split("\n");
  return lines.map((line, index) => `${index + startFrom}. ${line}`).join("\n");
}
function indent(text, spaces = 2) {
  const indentation = " ".repeat(spaces);
  return text.split("\n").map((line) => `${indentation}${line}`).join("\n");
}
function dedent(text, spaces = 2) {
  return text.split("\n").map((line) => {
    let removed = 0;
    let i = 0;
    while (i < line.length && line[i] === " " && removed < spaces) {
      i++;
      removed++;
    }
    return line.slice(i);
  }).join("\n");
}
function applyTransformation(text, transformation) {
  if (!transformation.enabled) {
    return text;
  }
  switch (transformation.type) {
    case "remove_blank_lines":
      return removeBlankLines(text);
    case "trim_lines":
      return trimLines(text);
    case "to_uppercase":
      return toUpperCase(text);
    case "to_lowercase":
      return toLowerCase(text);
    case "remove_duplicates":
      return removeDuplicates(text);
    case "sort_lines":
      return sortLines(text);
    case "reverse_lines":
      return reverseLines(text);
    case "wrap_code_block":
      return wrapCodeBlock(text, transformation.value || "");
    case "add_prefix":
      return addPrefix(text, transformation.value);
    case "add_suffix":
      return addSuffix(text, transformation.value);
    case "regex_replace": {
      const regexTrans = transformation;
      return regexReplace(text, regexTrans.pattern, regexTrans.replacement, regexTrans.flags);
    }
    case "number_lines":
      return numberLines(text, transformation.value || 1);
    case "indent":
      return indent(text, transformation.value || 2);
    case "dedent":
      return dedent(text, transformation.value || 2);
    default:
      return text;
  }
}
function applyTransformations(text, transformations) {
  const sorted = [...transformations].filter((t) => t.enabled).sort((a, b) => a.order - b.order);
  let result = text;
  for (const transformation of sorted) {
    try {
      result = applyTransformation(result, transformation);
    } catch (error) {
      console.error(`Error applying transformation ${transformation.type}:`, error);
      throw error;
    }
  }
  return result;
}
function Popover($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function TemplateCard($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { template } = $$props;
    let isProcessing = false;
    function getIcon(template2) {
      const firstTransform = template2.transformations.find((t) => t.enabled);
      if (!firstTransform) return File_text;
      switch (firstTransform.type) {
        case "wrap_code_block":
          return Code;
        case "add_prefix":
        case "add_suffix":
          return List;
        case "trim_lines":
        case "remove_blank_lines":
        case "dedent":
          return Scissors;
        case "to_uppercase":
        case "to_lowercase":
          return Type;
        case "number_lines":
          return Hash;
        default:
          return File_text;
      }
    }
    function getExamplePreview(template2) {
      const input = template2.exampleText || "lorem ipsum\n\ndolor sit amet";
      try {
        const output = applyTransformations(input, template2.transformations);
        return { input, output };
      } catch {
        return { input, output: "(preview error)" };
      }
    }
    const IconComponent = getIcon(template);
    getExamplePreview(template);
    $$renderer2.push(`<button type="button"${attr("disabled", isProcessing, true)} class="group relative flex flex-col items-center justify-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-wait min-w-30 min-h-25"><div class="text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"><!---->`);
    IconComponent($$renderer2, { size: 24 });
    $$renderer2.push(`<!----></div> <span class="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 text-center line-clamp-2">${escape_html(template.name)}</span></button> `);
    Popover($$renderer2);
    $$renderer2.push(`<!---->`);
  });
}
function CommandPalette($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { templates } = $$props;
    let searchQuery = "";
    function getGroupedTemplates(templates2, query) {
      let filtered = templates2;
      if (query.trim()) {
        const lowerQuery = query.toLowerCase();
        filtered = templates2.filter((t) => t.name.toLowerCase().includes(lowerQuery) || t.description.toLowerCase().includes(lowerQuery) || t.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery)));
      }
      const starred = filtered.filter((t) => t.starred).sort((a, b) => b.usageCount - a.usageCount);
      const unstarred = filtered.filter((t) => !t.starred);
      const byCategory = /* @__PURE__ */ new Map();
      for (const template of unstarred) {
        const category = template.category || "Other";
        if (!byCategory.has(category)) {
          byCategory.set(category, []);
        }
        byCategory.get(category).push(template);
      }
      const categories = Array.from(byCategory.keys()).sort();
      const groups = [];
      if (starred.length > 0) {
        groups.push({ name: "Starred", templates: starred, isStarred: true });
      }
      for (const category of categories) {
        const categoryTemplates = byCategory.get(category);
        categoryTemplates.sort((a, b) => b.usageCount - a.usageCount);
        groups.push({ name: category, templates: categoryTemplates });
      }
      return groups;
    }
    function getFlatList(groups) {
      return groups.flatMap((g) => g.templates);
    }
    const groupedTemplates = getGroupedTemplates(templates, searchQuery);
    getFlatList(groupedTemplates);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function ResultArea($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { input, output } = $$props;
    input.split("\n").length;
    output.split("\n").length;
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let resultInput = "";
    let resultOutput = "";
    const allTemplates = store_get($$store_subs ??= {}, "$templateStore", templateStore);
    const isMac = typeof navigator !== "undefined" && navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    const modKey = isMac ? "⌘" : "Ctrl";
    $$renderer2.push(`<div class="max-w-4xl mx-auto"><div class="flex items-center justify-between mb-8"><div><h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">Clipboard Converter</h1> <p class="text-gray-500 dark:text-gray-400 text-sm">Click a template to transform clipboard text instantly</p></div></div> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (store_get($$store_subs ??= {}, "$starredTemplates", starredTemplates).length > 0) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="mb-8"><h2 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Your Templates</h2> <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"><!--[-->`);
      const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$starredTemplates", starredTemplates));
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let template = each_array[$$index];
        TemplateCard($$renderer2, { template });
      }
      $$renderer2.push(`<!--]--></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="mb-8 p-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 text-center"><p class="text-gray-500 dark:text-gray-400 mb-4">No starred templates yet. Star your favorites for quick access!</p> <div class="flex items-center justify-center gap-4"><a href="/templates" class="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">Browse Templates</a> <button class="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">Search (${escape_html(modKey)}+K)</button></div></div>`);
    }
    $$renderer2.push(`<!--]--> `);
    ResultArea($$renderer2, {
      input: resultInput,
      output: resultOutput
    });
    $$renderer2.push(`<!----> <div class="m-8 text-center"><button class="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">`);
    Command($$renderer2, { size: 16 });
    $$renderer2.push(`<!----> Press <kbd class="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs font-medium">${escape_html(modKey)}+K</kbd> to search all templates</button></div> `);
    CommandPalette($$renderer2, {
      templates: allTemplates
    });
    $$renderer2.push(`<!----></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
