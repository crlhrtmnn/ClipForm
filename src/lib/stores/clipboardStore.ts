import { writable, derived } from 'svelte/store';
import type { ClipboardCapabilities } from '$lib/types/storage';

export interface ClipboardState {
	capabilities: ClipboardCapabilities | null;
	permissionRequested: boolean;
	lastError: string | null;
	mode: 'auto' | 'manual';
}

/**
 * Clipboard store for managing clipboard state
 */
function createClipboardStore() {
	const { subscribe, set, update } = writable<ClipboardState>({
		capabilities: null,
		permissionRequested: false,
		lastError: null,
		mode: 'auto'
	});

	return {
		subscribe,

		/**
		 * Set clipboard capabilities
		 */
		setCapabilities: (capabilities: ClipboardCapabilities) => {
			update((state) => ({ ...state, capabilities }));
		},

		/**
		 * Set mode (auto/manual)
		 */
		setMode: (mode: 'auto' | 'manual') => {
			update((state) => ({ ...state, mode }));
		},

		/**
		 * Set error message
		 */
		setError: (error: string | null) => {
			update((state) => ({ ...state, lastError: error }));
		},

		/**
		 * Mark permission as requested
		 */
		markPermissionRequested: () => {
			update((state) => ({ ...state, permissionRequested: true }));
		},

		/**
		 * Clear error
		 */
		clearError: () => {
			update((state) => ({ ...state, lastError: null }));
		},

		/**
		 * Reset state
		 */
		reset: () => {
			set({
				capabilities: null,
				permissionRequested: false,
				lastError: null,
				mode: 'auto'
			});
		}
	};
}

export const clipboardStore = createClipboardStore();

/**
 * Derived store: Can we auto-read clipboard?
 */
export const canAutoRead = derived(clipboardStore, ($clipboard) => {
	return (
		$clipboard.capabilities?.canReadText &&
		($clipboard.capabilities.permissionState === 'granted' ||
			$clipboard.capabilities.permissionState === 'prompt')
	);
});

/**
 * Derived store: Can we write to clipboard?
 */
export const canWrite = derived(clipboardStore, ($clipboard) => {
	return $clipboard.capabilities?.canWriteText === true;
});

/**
 * Derived store: Should show permission prompt?
 */
export const shouldShowPermissionPrompt = derived(clipboardStore, ($clipboard) => {
	return (
		$clipboard.capabilities?.canReadText &&
		$clipboard.capabilities.permissionState === 'prompt' &&
		!$clipboard.permissionRequested &&
		$clipboard.mode === 'auto'
	);
});
