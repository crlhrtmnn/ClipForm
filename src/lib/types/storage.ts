import type { Template } from './template';

/**
 * localStorage keys
 */
export const STORAGE_KEYS = {
	TEMPLATES: 'clipform:templates',
	SETTINGS: 'clipform:settings',
	RECENT_TEMPLATES: 'clipform:recent',
	VERSION: 'clipform:version'
} as const;

/**
 * App settings
 */
export interface AppSettings {
	theme: 'light' | 'dark' | 'auto';
	clipboardPermission: 'granted' | 'denied' | 'prompt' | 'unknown';
	autoReadClipboard: boolean;
	autoCopyResult: boolean;
	showDiffPreview: boolean;
	maxRecentTemplates: number;
	defaultCategory: string;
}

/**
 * Recent template usage
 */
export interface RecentTemplate {
	templateId: string;
	usedAt: string; // ISO timestamp
}

/**
 * Storage structure
 */
export interface StorageData {
	templates: Template[];
	settings: AppSettings;
	recent: RecentTemplate[];
	version: string;
}

/**
 * Default settings
 */
export const DEFAULT_SETTINGS: AppSettings = {
	theme: 'auto',
	clipboardPermission: 'unknown',
	autoReadClipboard: true,
	autoCopyResult: true,
	showDiffPreview: true,
	maxRecentTemplates: 10,
	defaultCategory: 'General'
};

/**
 * Clipboard capabilities
 */
export interface ClipboardCapabilities {
	hasClipboardAPI: boolean;
	canReadText: boolean;
	canWriteText: boolean;
	permissionState: PermissionState | 'unknown';
	requiresUserGesture: boolean;
}
