<script lang="ts">
	import { X, ClipboardPaste, Keyboard } from 'lucide-svelte';
	import type { Template } from '$lib/types/template';

	interface Props {
		open: boolean;
		template: Template | null;
		onPaste: (text: string) => void;
		onClose: () => void;
	}

	let { open, template, onPaste, onClose }: Props = $props();
	let textareaRef = $state<HTMLTextAreaElement | null>(null);
	let textContent = $state('');
	let wasTypedManually = $state(false);
	let isExiting = $state(false);

	// Reset state when modal opens
	$effect(() => {
		if (open) {
			textContent = '';
			wasTypedManually = false;
			isExiting = false;
			// Small delay to ensure modal is rendered
			setTimeout(() => {
				textareaRef?.focus();
			}, 50);
		}
	});

	// Animate out then call the actual callback
	function animateOut(callback: () => void) {
		isExiting = true;
		setTimeout(() => {
			callback();
			isExiting = false;
		}, 150); // Match exit animation duration
	}

	function handlePaste(e: ClipboardEvent) {
		e.preventDefault();
		const text = e.clipboardData?.getData('text/plain') || '';
		if (text.trim()) {
			animateOut(() => onPaste(text));
		}
	}

	function handleInput(e: Event) {
		const target = e.target as HTMLTextAreaElement;
		textContent = target.value;
		// If content changed and it wasn't from a paste, user typed manually
		if (textContent.length > 0) {
			wasTypedManually = true;
		}
	}

	function handleManualSubmit() {
		if (textContent.trim()) {
			animateOut(() => onPaste(textContent));
		}
	}

	function handleClose() {
		animateOut(onClose);
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			e.preventDefault();
			handleClose();
		}
		// Allow Enter+Ctrl/Cmd to submit when there's manual content
		if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && wasTypedManually && textContent.trim()) {
			e.preventDefault();
			handleManualSubmit();
		}
	}

	// Platform detection
	const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
	const modKey = isMac ? '⌘' : 'Ctrl';
</script>

{#if open && template}
	<!-- Backdrop -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-transition {isExiting ? 'backdrop-exit' : 'backdrop-enter'}"
		onclick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
		onkeydown={handleKeyDown}
	>
		<!-- Modal -->
		<div 
			class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden modal-container"
			class:modal-exit={isExiting}
		>
			<!-- Header -->
			<div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
				<div class="flex items-center gap-3">
					<div class="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
						<ClipboardPaste size={20} class="text-blue-600 dark:text-blue-400" />
					</div>
					<div>
						<h3 class="font-semibold text-gray-900 dark:text-gray-100">{template.name}</h3>
					</div>
				</div>
				<button
					onclick={handleClose}
					class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
				>
					<X size={20} />
				</button>
			</div>

			<!-- Content -->
			<div class="p-4">
				<!-- Paste Zone -->
				<div 
					class="relative border-2 border-dashed rounded-xl bg-gray-50 dark:bg-gray-900/50 transition-all duration-300 paste-zone-enter"
					class:border-blue-400={!textContent}
					class:dark:border-blue-500={!textContent}
					class:border-gray-300={textContent}
					class:dark:border-gray-600={textContent}
				>
					{#if !textContent}
						<!-- Empty state overlay -->
						<div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-4 hint-enter">
							<div class="flex items-center gap-2 mb-2 text-blue-500 dark:text-blue-400">
								<Keyboard size={24} />
								<span class="text-lg font-semibold">{modKey}+V</span>
							</div>
							<p class="text-sm text-gray-500 dark:text-gray-400">to paste your text</p>
						</div>
					{/if}
					
					<textarea
						bind:this={textareaRef}
						bind:value={textContent}
						onpaste={handlePaste}
						oninput={handleInput}
						onkeydown={handleKeyDown}
						class="w-full h-36 p-4 bg-transparent text-sm font-mono text-gray-900 dark:text-gray-100 placeholder-transparent focus:outline-none resize-none relative z-10"
						style="caret-color: {textContent ? 'auto' : 'transparent'};"
					></textarea>
				</div>

				<!-- Manual submit button - only shows when user types manually -->
				{#if wasTypedManually && textContent.trim()}
					<button
						onclick={handleManualSubmit}
						class="mt-3 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
					>
						Transform
						<kbd class="px-1.5 py-0.5 bg-blue-500 rounded text-xs">{modKey}+Enter</kbd>
					</button>
				{/if}
			</div>

			<!-- Footer -->
			<div class="px-4 pb-4">
				<button
					onclick={handleClose}
					class="w-full py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
				>
					Cancel
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Backdrop states */
	.backdrop-transition {
		transition: background-color 0.15s ease-out, backdrop-filter 0.15s ease-out;
	}
	
	.backdrop-enter {
		background-color: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(4px);
	}
	
	.backdrop-exit {
		background-color: rgba(0, 0, 0, 0);
		backdrop-filter: blur(0);
	}
	
	/* Modal container entrance */
	.modal-container {
		animation: modal-enter 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
	}
	
	@keyframes modal-enter {
		0% {
			opacity: 0;
			transform: scale(0.95) translateY(8px);
		}
		100% {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}
	
	/* Modal exit */
	.modal-exit {
		animation: modal-leave 0.15s ease-out forwards;
	}
	
	@keyframes modal-leave {
		0% {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
		100% {
			opacity: 0;
			transform: scale(0.97) translateY(4px);
		}
	}
	
	/* Paste zone settles into place with a gentle spring */
	.paste-zone-enter {
		animation: settle 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
	}
	
	@keyframes settle {
		0% {
			opacity: 0.8;
			transform: scale(0.97);
		}
		100% {
			opacity: 1;
			transform: scale(1);
		}
	}
	
	/* Hint fades up slightly */
	.hint-enter {
		animation: hint-appear 0.5s ease-out 0.1s both;
	}
	
	@keyframes hint-appear {
		0% {
			opacity: 0;
			transform: translateY(4px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
