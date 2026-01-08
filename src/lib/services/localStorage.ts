import type { Template } from "$lib/types/template";
import type { AppSettings, RecentTemplate } from "$lib/types/storage";
import { STORAGE_KEYS, DEFAULT_SETTINGS } from "$lib/types/storage";
import { browser } from "$app/environment";

/**
 * Default templates to seed on first load
 */
export const DEFAULT_TEMPLATES: Template[] = [
  {
    id: "remove-blank-lines",
    name: "Remove Blank Lines",
    description: "Remove all blank lines from text",
    transformations: [
      {
        id: "1",
        type: "remove_blank_lines",
        enabled: true,
        order: 1,
      },
    ],
    starred: true,
    category: "Basic",
    tags: ["cleanup"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 0,
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
        order: 1,
      },
    ],
    starred: true,
    category: "Markdown",
    tags: ["code", "markdown"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 0,
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
        order: 1,
      },
      {
        id: "2",
        type: "trim_lines",
        enabled: true,
        order: 2,
      },
      {
        id: "3",
        type: "wrap_code_block",
        value: "log",
        enabled: true,
        order: 3,
      },
    ],
    starred: false,
    category: "Logging",
    tags: ["grafana", "errors", "logs"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 0,
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
        order: 1,
      },
    ],
    starred: false,
    category: "Basic",
    tags: ["cleanup"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 0,
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
        order: 1,
      },
    ],
    starred: true,
    category: "Markdown",
    tags: ["markdown", "list"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 0,
  },
  {
    id: "numbered-list",
    name: "Numbered List",
    description: "Convert lines to numbered list (1. 2. 3.)",
    transformations: [
      {
        id: "1",
        type: "number_lines",
        value: 1,
        enabled: true,
        order: 1,
      },
    ],
    starred: false,
    category: "Markdown",
    tags: ["markdown", "list", "numbered"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 0,
  },
  {
    id: "json-code-block",
    name: "JSON Code Block",
    description: "Trim and wrap text in JSON code block",
    transformations: [
      {
        id: "1",
        type: "trim_lines",
        enabled: true,
        order: 1,
      },
      {
        id: "2",
        type: "wrap_code_block",
        value: "json",
        enabled: true,
        order: 2,
      },
    ],
    starred: false,
    category: "Code",
    tags: ["code", "json", "markdown"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 0,
  },
  {
    id: "sql-code-block",
    name: "SQL Code Block",
    description: "Wrap text in SQL code block",
    transformations: [
      {
        id: "1",
        type: "wrap_code_block",
        value: "sql",
        enabled: true,
        order: 1,
      },
    ],
    starred: false,
    category: "Code",
    tags: ["code", "sql", "markdown", "database"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 0,
  },
  {
    id: "remove-duplicates",
    name: "Remove Duplicates",
    description: "Remove duplicate lines, keeping first occurrence",
    transformations: [
      {
        id: "1",
        type: "remove_duplicates",
        enabled: true,
        order: 1,
      },
    ],
    starred: false,
    category: "Data",
    tags: ["cleanup", "duplicates", "data"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 0,
  },
  {
    id: "sort-lines",
    name: "Sort Lines A-Z",
    description: "Sort lines alphabetically",
    transformations: [
      {
        id: "1",
        type: "sort_lines",
        enabled: true,
        order: 1,
      },
    ],
    starred: false,
    category: "Data",
    tags: ["sort", "alphabetical", "data"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 0,
  },
  {
    id: "quote-block",
    name: "Quote Block",
    description: "Convert text to Markdown blockquote",
    transformations: [
      {
        id: "1",
        type: "add_prefix",
        value: "> ",
        enabled: true,
        order: 1,
      },
    ],
    starred: true,
    category: "Markdown",
    tags: ["markdown", "quote", "blockquote"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 0,
  },
  {
    id: "checkbox-list",
    name: "Checkbox List",
    description: "Convert lines to Markdown task list",
    transformations: [
      {
        id: "1",
        type: "add_prefix",
        value: "- [ ] ",
        enabled: true,
        order: 1,
      },
    ],
    starred: false,
    category: "Markdown",
    tags: ["markdown", "tasks", "todo", "checklist"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 0,
  },
  {
    id: "snake-to-title",
    name: "Snake to Title Case",
    description: "Convert snake_case to Title Case",
    transformations: [
      {
        id: "1",
        type: "regex_replace",
        pattern: "_",
        replacement: " ",
        flags: "g",
        enabled: true,
        order: 1,
      },
      {
        id: "2",
        type: "regex_replace",
        pattern: "\\b\\w",
        replacement: "$&",
        flags: "g",
        enabled: true,
        order: 2,
      },
    ],
    starred: false,
    category: "Transform",
    tags: ["case", "naming", "convert"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 0,
  },
  {
    id: "clean-data-lines",
    name: "Clean Data Lines",
    description: "Trim, remove blanks, and deduplicate lines",
    transformations: [
      {
        id: "1",
        type: "trim_lines",
        enabled: true,
        order: 1,
      },
      {
        id: "2",
        type: "remove_blank_lines",
        enabled: true,
        order: 2,
      },
      {
        id: "3",
        type: "remove_duplicates",
        enabled: true,
        order: 3,
      },
    ],
    starred: false,
    category: "Data",
    tags: ["cleanup", "data", "csv"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 0,
  },
  {
    id: "indent-4-spaces",
    name: "Indent 4 Spaces",
    description: "Add 4 spaces to the start of each line",
    transformations: [
      {
        id: "1",
        type: "indent",
        value: 4,
        enabled: true,
        order: 1,
      },
    ],
    starred: false,
    category: "Basic",
    tags: ["indent", "whitespace", "code"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 0,
  },
  {
    id: "csv-to-markdown-table",
    name: "CSV to Markdown Table",
    description:
      "Convert CSV rows to Markdown table format (add separator row manually)",
    transformations: [
      {
        id: "1",
        type: "regex_replace",
        pattern: ",",
        replacement: " | ",
        flags: "g",
        enabled: true,
        order: 1,
      },
      {
        id: "2",
        type: "add_prefix",
        value: "| ",
        enabled: true,
        order: 2,
      },
      {
        id: "3",
        type: "add_suffix",
        value: " |",
        enabled: true,
        order: 3,
      },
    ],
    starred: false,
    category: "Data",
    tags: ["csv", "markdown", "table", "data"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    usageCount: 0,
  },
];

/**
 * Check if we're in a browser environment
 */
function isBrowser(): boolean {
  return (
    browser &&
    typeof window !== "undefined" &&
    typeof window.localStorage !== "undefined"
  );
}

/**
 * Load templates from localStorage
 */
export function loadTemplates(): Template[] {
  if (!isBrowser()) {
    return DEFAULT_TEMPLATES;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading templates from localStorage:", error);
  }

  // First load - seed with default templates
  seedDefaultTemplates();
  return DEFAULT_TEMPLATES;
}

/**
 * Save templates to localStorage
 */
export function saveTemplates(templates: Template[]): void {
  if (!isBrowser()) {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
  } catch (error) {
    console.error("Error saving templates to localStorage:", error);
    throw new Error("Failed to save templates. Storage quota may be exceeded.");
  }
}

/**
 * Seed default templates (called on first load)
 */
export function seedDefaultTemplates(): void {
  if (!isBrowser()) {
    return;
  }

  try {
    localStorage.setItem(
      STORAGE_KEYS.TEMPLATES,
      JSON.stringify(DEFAULT_TEMPLATES)
    );
    localStorage.setItem(STORAGE_KEYS.VERSION, "1.0.0");
  } catch (error) {
    console.error("Error seeding default templates:", error);
  }
}

/**
 * Load settings from localStorage
 */
export function loadSettings(): AppSettings {
  if (!isBrowser()) {
    return DEFAULT_SETTINGS;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (stored) {
      const settings = JSON.parse(stored);
      // Merge with defaults to handle new settings
      return { ...DEFAULT_SETTINGS, ...settings };
    }
  } catch (error) {
    console.error("Error loading settings from localStorage:", error);
  }

  return DEFAULT_SETTINGS;
}

/**
 * Save settings to localStorage
 */
export function saveSettings(settings: AppSettings): void {
  if (!isBrowser()) {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error("Error saving settings to localStorage:", error);
  }
}

/**
 * Load recent templates from localStorage
 */
export function loadRecentTemplates(): RecentTemplate[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.RECENT_TEMPLATES);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading recent templates:", error);
  }

  return [];
}

/**
 * Save recent templates to localStorage
 */
export function saveRecentTemplates(recent: RecentTemplate[]): void {
  if (!isBrowser()) {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEYS.RECENT_TEMPLATES, JSON.stringify(recent));
  } catch (error) {
    console.error("Error saving recent templates:", error);
  }
}

/**
 * Export templates as JSON string
 */
export function exportTemplates(templates: Template[]): string {
  return JSON.stringify(templates, null, 2);
}

/**
 * Import templates from JSON string
 */
export function importTemplates(json: string): Template[] {
  try {
    const templates = JSON.parse(json);
    if (!Array.isArray(templates)) {
      throw new Error("Invalid format: expected an array of templates");
    }
    // Basic validation
    for (const template of templates) {
      if (!template.id || !template.name || !template.transformations) {
        throw new Error("Invalid template format");
      }
    }
    return templates;
  } catch (error) {
    throw new Error("Failed to import templates: " + (error as Error).message);
  }
}

/**
 * Clear all data from localStorage
 */
export function clearAllData(): void {
  if (!isBrowser()) {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEYS.TEMPLATES);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.RECENT_TEMPLATES);
    localStorage.removeItem(STORAGE_KEYS.VERSION);
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
}
