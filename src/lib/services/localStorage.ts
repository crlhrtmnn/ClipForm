import type { Template } from '$lib/types/template';
import type { AppSettings, RecentTemplate } from '$lib/types/storage';
import { STORAGE_KEYS, DEFAULT_SETTINGS } from '$lib/types/storage';
import { browser } from '$app/environment';

/**
 * Default templates to seed on first load
 */
export const DEFAULT_TEMPLATES: Template[] = [
	{
		id: 'remove-blank-lines',
		name: 'Remove Blank Lines',
		description: 'Remove all blank lines from text',
		transformations: [
			{
				id: '1',
				type: 'remove_blank_lines',
				enabled: true,
				order: 1
			}
		],
		starred: false,
		category: 'Basic',
		tags: ['cleanup'],
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		usageCount: 0
	},
	{
		id: 'wrap-code',
		name: 'Wrap in Code Block',
		description: 'Wrap text in markdown code block',
		transformations: [
			{
				id: '1',
				type: 'wrap_code_block',
				value: '',
				enabled: true,
				order: 1
			}
		],
		starred: true,
		category: 'Markdown',
		tags: ['code', 'markdown'],
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		usageCount: 0
	},
	{
		id: 'format-grafana-errors',
		name: 'Format Grafana Errors',
		description: 'Clean up Grafana error logs and wrap in code block',
		transformations: [
			{
				id: '1',
				type: 'remove_blank_lines',
				enabled: true,
				order: 1
			},
			{
				id: '2',
				type: 'trim_lines',
				enabled: true,
				order: 2
			},
			{
				id: '3',
				type: 'wrap_code_block',
				value: 'log',
				enabled: true,
				order: 3
			}
		],
		starred: true,
		category: 'Logging',
		tags: ['grafana', 'errors', 'logs'],
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		usageCount: 0
	},
	{
		id: 'trim-lines',
		name: 'Trim All Lines',
		description: 'Remove leading/trailing whitespace from each line',
		transformations: [
			{
				id: '1',
				type: 'trim_lines',
				enabled: true,
				order: 1
			}
		],
		starred: false,
		category: 'Basic',
		tags: ['cleanup'],
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		usageCount: 0
	},
	{
		id: 'bullet-list',
		name: 'Convert to Bullet List',
		description: 'Add "- " prefix to each line',
		transformations: [
			{
				id: '1',
				type: 'add_prefix',
				value: '- ',
				enabled: true,
				order: 1
			}
		],
		starred: false,
		category: 'Markdown',
		tags: ['markdown', 'list'],
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		usageCount: 0
	}
];

/**
 * Check if we're in a browser environment
 */
function isBrowser(): boolean {
	return browser && typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
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
		console.error('Error loading templates from localStorage:', error);
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
		console.error('Error saving templates to localStorage:', error);
		throw new Error('Failed to save templates. Storage quota may be exceeded.');
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
		localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(DEFAULT_TEMPLATES));
		localStorage.setItem(STORAGE_KEYS.VERSION, '1.0.0');
	} catch (error) {
		console.error('Error seeding default templates:', error);
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
		console.error('Error loading settings from localStorage:', error);
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
		console.error('Error saving settings to localStorage:', error);
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
		console.error('Error loading recent templates:', error);
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
		console.error('Error saving recent templates:', error);
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
			throw new Error('Invalid format: expected an array of templates');
		}
		// Basic validation
		for (const template of templates) {
			if (!template.id || !template.name || !template.transformations) {
				throw new Error('Invalid template format');
			}
		}
		return templates;
	} catch (error) {
		throw new Error('Failed to import templates: ' + (error as Error).message);
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
		console.error('Error clearing localStorage:', error);
	}
}
