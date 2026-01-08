<script lang="ts">
	import { X, ClipboardPaste } from 'lucide-svelte';
	import type { Template } from '$lib/types/template';

	interface Props {
		open: boolean;
		template: Template | null;
		onPaste: (text: string) => void;
		onClose: () => void;
	}

	let { open, template, onPaste, onClose }: Props = $props();
	let textareaRef = $state<HTMLTextAreaElement | null>(null);

	// Focus textarea when modal opens
	$effect(() => {
		if (open && textareaRef) {
			// Small delay to ensure modal is rendered
			setTimeout(() => {
				textareaRef?.focus();
			}, 50);
		}
	});

	function handlePaste(e: ClipboardEvent) {
		e.preventDefault();
		const text = e.clipboardData?.getData('text/plain') || '';
		if (text.trim()) {
			onPaste(text);
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			e.preventDefault();
			onClose();
		}
	}
</script>

{#if open && template}
	<!-- Backdrop -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
		onclick={(e) => { if (e.target === e.currentTarget) onClose(); }}
		onkeydown={handleKeyDown}
	>
		<!-- Modal -->
		<div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
			<!-- Header -->
			<div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
				<div class="flex items-center gap-3">
					<div class="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
						<ClipboardPaste size={20} class="text-orange-600 dark:text-orange-400" />
					</div>
					<div>
						<h3 class="font-semibold text-gray-900 dark:text-gray-100">Paste Your Text</h3>
						<p class="text-sm text-gray-500 dark:text-gray-400">{template.name}</p>
					</div>
				</div>
				<button
					onclick={onClose}
					class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
				>
					<X size={20} />
				</button>
			</div>

			<!-- Content -->
			<div class="p-4">
				<div class="mb-3">
					<p class="text-sm text-gray-600 dark:text-gray-400">
						Firefox requires an extra step for clipboard access. Press <kbd class="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs font-medium">Ctrl+V</kbd> (or <kbd class="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs font-medium">⌘+V</kbd> on Mac) to paste your text:
					</p>
				</div>

				<textarea
					bind:this={textareaRef}
					onpaste={handlePaste}
					onkeydown={handleKeyDown}
					placeholder="Click here and press Ctrl+V to paste..."
					class="w-full h-32 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-mono text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
				></textarea>

				<p class="mt-2 text-xs text-gray-400 dark:text-gray-500">
					Your pasted text will be transformed and copied back automatically.
				</p>
			</div>

			<!-- Footer -->
			<div class="px-4 pb-4">
				<button
					onclick={onClose}
					class="w-full py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
				>
					Cancel
				</button>
			</div>
		</div>
	</div>
{/if}
