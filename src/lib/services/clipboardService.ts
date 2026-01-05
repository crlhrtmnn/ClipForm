import type { ClipboardCapabilities } from '$lib/types/storage';
import { browser } from '$app/environment';

/**
 * Detect clipboard capabilities
 */
export async function detectClipboardCapabilities(): Promise<ClipboardCapabilities> {
	if (!browser) {
		return {
			hasClipboardAPI: false,
			canReadText: false,
			canWriteText: false,
			permissionState: 'unknown',
			requiresUserGesture: true
		};
	}

	const hasClipboardAPI = typeof navigator.clipboard !== 'undefined';
	let permissionState: PermissionState | 'unknown' = 'unknown';

	if (navigator.permissions && hasClipboardAPI) {
		try {
			const result = await navigator.permissions.query({
				name: 'clipboard-read' as PermissionName
			});
			permissionState = result.state;
		} catch (e) {
			// clipboard-read permission not supported in this browser
			permissionState = 'unknown';
		}
	}

	return {
		hasClipboardAPI,
		canReadText: hasClipboardAPI && 'readText' in navigator.clipboard,
		canWriteText: hasClipboardAPI && 'writeText' in navigator.clipboard,
		permissionState,
		requiresUserGesture: true
	};
}

/**
 * Read text from clipboard
 * @throws Error if permission denied or API unavailable
 */
export async function readClipboard(): Promise<string> {
	if (!browser) {
		throw new Error('Clipboard API not available (not in browser)');
	}

	if (!navigator.clipboard || !navigator.clipboard.readText) {
		throw new Error('Clipboard API not available in this browser');
	}

	try {
		const text = await navigator.clipboard.readText();
		return text;
	} catch (error) {
		if (error instanceof Error) {
			if (error.name === 'NotAllowedError') {
				throw new Error(
					'Clipboard permission denied. Please allow clipboard access or paste manually.'
				);
			}
		}
		throw new Error('Failed to read clipboard');
	}
}

/**
 * Write text to clipboard
 * @throws Error if permission denied or API unavailable
 */
export async function writeClipboard(text: string): Promise<void> {
	if (!browser) {
		throw new Error('Clipboard API not available (not in browser)');
	}

	if (!navigator.clipboard || !navigator.clipboard.writeText) {
		throw new Error('Clipboard API not available in this browser');
	}

	try {
		await navigator.clipboard.writeText(text);
	} catch (error) {
		if (error instanceof Error) {
			if (error.name === 'NotAllowedError') {
				throw new Error('Clipboard write permission denied');
			}
		}
		throw new Error('Failed to write to clipboard');
	}
}

/**
 * Request clipboard permission explicitly
 */
export async function requestClipboardPermission(): Promise<boolean> {
	if (!browser) {
		return false;
	}

	try {
		// Attempt to read clipboard (which triggers permission prompt)
		await navigator.clipboard.readText();
		return true;
	} catch {
		return false;
	}
}

/**
 * Fallback clipboard operations using textarea (for older browsers)
 */
export class FallbackClipboard {
	/**
	 * Copy text using document.execCommand (deprecated but widely supported)
	 */
	static copy(text: string): boolean {
		if (!browser) {
			return false;
		}

		const textarea = document.createElement('textarea');
		textarea.value = text;
		textarea.style.position = 'fixed';
		textarea.style.opacity = '0';
		textarea.style.pointerEvents = 'none';
		document.body.appendChild(textarea);
		textarea.select();

		let success = false;
		try {
			success = document.execCommand('copy');
		} catch (e) {
			console.error('Fallback copy failed', e);
		}

		document.body.removeChild(textarea);
		return success;
	}

	/**
	 * Create a paste event listener
	 * Returns cleanup function
	 */
	static onPaste(callback: (text: string) => void): () => void {
		if (!browser) {
			return () => {};
		}

		const handler = (e: ClipboardEvent) => {
			e.preventDefault();
			const text = e.clipboardData?.getData('text/plain') || '';
			callback(text);
		};

		document.addEventListener('paste', handler);

		// Return cleanup function
		return () => document.removeEventListener('paste', handler);
	}
}

/**
 * Try to copy with fallback to document.execCommand
 */
export async function copyWithFallback(text: string): Promise<boolean> {
	if (!browser) {
		return false;
	}

	// Try modern API first
	try {
		await writeClipboard(text);
		return true;
	} catch (error) {
		console.warn('Modern clipboard API failed, trying fallback:', error);
		// Try fallback
		return FallbackClipboard.copy(text);
	}
}
