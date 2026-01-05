import { writable, derived, get } from 'svelte/store';
import type { Template } from '$lib/types/template';
import type { RecentTemplate } from '$lib/types/storage';
import {
	loadTemplates,
	saveTemplates,
	loadRecentTemplates,
	saveRecentTemplates
} from '$lib/services/localStorage';
import { browser } from '$app/environment';

/**
 * Template store with CRUD operations
 */
function createTemplateStore() {
	const { subscribe, set, update } = writable<Template[]>(loadTemplates());

	// Auto-save to localStorage whenever templates change
	if (browser) {
		subscribe((templates) => {
			saveTemplates(templates);
		});
	}

	return {
		subscribe,

		/**
		 * Create a new template
		 */
		create: (template: Omit<Template, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => {
			const newTemplate: Template = {
				...template,
				id: `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				usageCount: 0
			};

			update((templates) => [...templates, newTemplate]);
			return newTemplate.id;
		},

		/**
		 * Update an existing template
		 */
		update: (id: string, updates: Partial<Template>) => {
			update((templates) =>
				templates.map((template) =>
					template.id === id
						? { ...template, ...updates, updatedAt: new Date().toISOString() }
						: template
				)
			);
		},

		/**
		 * Delete a template
		 */
		delete: (id: string) => {
			update((templates) => templates.filter((template) => template.id !== id));
		},

		/**
		 * Toggle star status
		 */
		toggleStar: (id: string) => {
			update((templates) =>
				templates.map((template) =>
					template.id === id
						? { ...template, starred: !template.starred, updatedAt: new Date().toISOString() }
						: template
				)
			);
		},

		/**
		 * Increment usage count
		 */
		incrementUsageCount: (id: string) => {
			update((templates) =>
				templates.map((template) =>
					template.id === id ? { ...template, usageCount: template.usageCount + 1 } : template
				)
			);
		},

		/**
		 * Get template by ID
		 */
		getById: (id: string): Template | undefined => {
			return get({ subscribe }).find((template) => template.id === id);
		},

		/**
		 * Search templates by name or description
		 */
		search: (query: string): Template[] => {
			const templates = get({ subscribe });
			if (!query.trim()) {
				return templates;
			}

			const lowerQuery = query.toLowerCase();
			return templates.filter(
				(template) =>
					template.name.toLowerCase().includes(lowerQuery) ||
					template.description.toLowerCase().includes(lowerQuery) ||
					template.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
			);
		},

		/**
		 * Filter templates by category
		 */
		filterByCategory: (category: string): Template[] => {
			const templates = get({ subscribe });
			if (!category) {
				return templates;
			}
			return templates.filter((template) => template.category === category);
		},

		/**
		 * Get all categories
		 */
		getCategories: (): string[] => {
			const templates = get({ subscribe });
			const categories = new Set<string>();
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
		duplicate: (id: string) => {
			const template = get({ subscribe }).find((t) => t.id === id);
			if (!template) {
				return;
			}

			const duplicated: Template = {
				...template,
				id: `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
				name: `${template.name} (Copy)`,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
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
			const { DEFAULT_TEMPLATES } = require('$lib/services/localStorage');
			set(DEFAULT_TEMPLATES);
		}
	};
}

export const templateStore = createTemplateStore();

/**
 * Derived store: starred templates
 */
export const starredTemplates = derived(templateStore, ($templates) =>
	$templates.filter((t) => t.starred).sort((a, b) => b.usageCount - a.usageCount)
);

/**
 * Derived store: recent templates
 */
function createRecentTemplatesStore() {
	const recent = writable<RecentTemplate[]>(loadRecentTemplates());

	if (browser) {
		recent.subscribe((value) => {
			saveRecentTemplates(value);
		});
	}

	return {
		subscribe: recent.subscribe,

		/**
		 * Add template to recent list
		 */
		add: (templateId: string) => {
			recent.update((list) => {
				// Remove if already exists
				const filtered = list.filter((item) => item.templateId !== templateId);
				// Add to front
				const newList = [{ templateId, usedAt: new Date().toISOString() }, ...filtered];
				// Keep only last 10
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

export const recentTemplatesStore = createRecentTemplatesStore();

/**
 * Derived store: get recent templates with full template data
 */
export const recentTemplates = derived(
	[templateStore, recentTemplatesStore],
	([$templates, $recent]) => {
		return $recent
			.map((item) => $templates.find((t) => t.id === item.templateId))
			.filter((t): t is Template => t !== undefined);
	}
);
