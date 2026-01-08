import { d as derived, w as writable, g as get } from "./index.js";
const DEFAULT_TEMPLATES = [
  {
    id: "remove-blank-lines",
    name: "Remove Blank Lines",
    description: "Remove all blank lines from text",
    transformations: [
      {
        id: "1",
        type: "remove_blank_lines",
        enabled: true,
        order: 1
      }
    ],
    starred: false,
    category: "Basic",
    tags: ["cleanup"],
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    usageCount: 0
  },
  {
    id: "wrap-code",
    name: "Wrap in Code Block",
    description: "Wrap text in markdown code block",
    transformations: [
      {
        id: "1",
        type: "wrap_code_block",
        value: "",
        enabled: true,
        order: 1
      }
    ],
    starred: true,
    category: "Markdown",
    tags: ["code", "markdown"],
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    usageCount: 0
  },
  {
    id: "format-grafana-errors",
    name: "Format Grafana Errors",
    description: "Clean up Grafana error logs and wrap in code block",
    transformations: [
      {
        id: "1",
        type: "remove_blank_lines",
        enabled: true,
        order: 1
      },
      {
        id: "2",
        type: "trim_lines",
        enabled: true,
        order: 2
      },
      {
        id: "3",
        type: "wrap_code_block",
        value: "log",
        enabled: true,
        order: 3
      }
    ],
    starred: true,
    category: "Logging",
    tags: ["grafana", "errors", "logs"],
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    usageCount: 0
  },
  {
    id: "trim-lines",
    name: "Trim All Lines",
    description: "Remove leading/trailing whitespace from each line",
    transformations: [
      {
        id: "1",
        type: "trim_lines",
        enabled: true,
        order: 1
      }
    ],
    starred: false,
    category: "Basic",
    tags: ["cleanup"],
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    usageCount: 0
  },
  {
    id: "bullet-list",
    name: "Convert to Bullet List",
    description: 'Add "- " prefix to each line',
    transformations: [
      {
        id: "1",
        type: "add_prefix",
        value: "- ",
        enabled: true,
        order: 1
      }
    ],
    starred: false,
    category: "Markdown",
    tags: ["markdown", "list"],
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
    usageCount: 0
  }
];
function loadTemplates() {
  {
    return DEFAULT_TEMPLATES;
  }
}
function loadRecentTemplates() {
  {
    return [];
  }
}
function createTemplateStore() {
  const { subscribe, set, update } = writable(loadTemplates());
  return {
    subscribe,
    /**
     * Create a new template
     */
    create: (template) => {
      const newTemplate = {
        ...template,
        id: `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        usageCount: 0
      };
      update((templates) => [...templates, newTemplate]);
      return newTemplate.id;
    },
    /**
     * Update an existing template
     */
    update: (id, updates) => {
      update(
        (templates) => templates.map(
          (template) => template.id === id ? { ...template, ...updates, updatedAt: (/* @__PURE__ */ new Date()).toISOString() } : template
        )
      );
    },
    /**
     * Delete a template
     */
    delete: (id) => {
      update((templates) => templates.filter((template) => template.id !== id));
    },
    /**
     * Toggle star status
     */
    toggleStar: (id) => {
      update(
        (templates) => templates.map(
          (template) => template.id === id ? { ...template, starred: !template.starred, updatedAt: (/* @__PURE__ */ new Date()).toISOString() } : template
        )
      );
    },
    /**
     * Increment usage count
     */
    incrementUsageCount: (id) => {
      update(
        (templates) => templates.map(
          (template) => template.id === id ? { ...template, usageCount: template.usageCount + 1 } : template
        )
      );
    },
    /**
     * Get template by ID
     */
    getById: (id) => {
      return get({ subscribe }).find((template) => template.id === id);
    },
    /**
     * Search templates by name or description
     */
    search: (query) => {
      const templates = get({ subscribe });
      if (!query.trim()) {
        return templates;
      }
      const lowerQuery = query.toLowerCase();
      return templates.filter(
        (template) => template.name.toLowerCase().includes(lowerQuery) || template.description.toLowerCase().includes(lowerQuery) || template.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );
    },
    /**
     * Filter templates by category
     */
    filterByCategory: (category) => {
      const templates = get({ subscribe });
      if (!category) {
        return templates;
      }
      return templates.filter((template) => template.category === category);
    },
    /**
     * Get all categories
     */
    getCategories: () => {
      const templates = get({ subscribe });
      const categories = /* @__PURE__ */ new Set();
      templates.forEach((template) => {
        if (template.category) {
          categories.add(template.category);
        }
      });
      return Array.from(categories).sort();
    },
    /**
     * Duplicate a template
     */
    duplicate: (id) => {
      const template = get({ subscribe }).find((t) => t.id === id);
      if (!template) {
        return;
      }
      const duplicated = {
        ...template,
        id: `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: `${template.name} (Copy)`,
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
        usageCount: 0,
        starred: false
      };
      update((templates) => [...templates, duplicated]);
      return duplicated.id;
    },
    /**
     * Reset to default templates
     */
    reset: () => {
      const { DEFAULT_TEMPLATES: DEFAULT_TEMPLATES2 } = require("$lib/services/localStorage");
      set(DEFAULT_TEMPLATES2);
    }
  };
}
const templateStore = createTemplateStore();
const starredTemplates = derived(
  templateStore,
  ($templates) => $templates.filter((t) => t.starred).sort((a, b) => b.usageCount - a.usageCount)
);
function createRecentTemplatesStore() {
  const recent = writable(loadRecentTemplates());
  return {
    subscribe: recent.subscribe,
    /**
     * Add template to recent list
     */
    add: (templateId) => {
      recent.update((list) => {
        const filtered = list.filter((item) => item.templateId !== templateId);
        const newList = [{ templateId, usedAt: (/* @__PURE__ */ new Date()).toISOString() }, ...filtered];
        return newList.slice(0, 10);
      });
    },
    /**
     * Clear recent templates
     */
    clear: () => {
      recent.set([]);
    }
  };
}
const recentTemplatesStore = createRecentTemplatesStore();
derived(
  [templateStore, recentTemplatesStore],
  ([$templates, $recent]) => {
    return $recent.map((item) => $templates.find((t) => t.id === item.templateId)).filter((t) => t !== void 0);
  }
);
export {
  starredTemplates as s,
  templateStore as t
};
