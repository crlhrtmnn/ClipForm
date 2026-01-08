<script lang="ts">
	import type { Template } from '$lib/types/template';
	import { applyTransformations } from '$lib/services/transformEngine';
	import { readClipboard, copyWithFallback, needsPasteWorkaround } from '$lib/services/clipboardService';
	import { templateStore, recentTemplatesStore } from '$lib/stores/templateStore';
	import { toast } from '$lib/stores/uiStore';
	import { Code, List, Scissors, Type, Hash, FileText } from 'lucide-svelte';
	import Popover from './Popover.svelte';

	interface Props {
		template: Template;
		onTransform: (result: { input: string; output: string; template: Template }) => void;
		onFirefoxPaste?: (template: Template) => void;
	}

	let { template, onTransform, onFirefoxPaste }: Props = $props();

	let isProcessing = $state(false);
	let isHovered = $state(false);
	let cardRef = $state<HTMLElement | null>(null);

	// Get icon based on first transformation type
	function getIcon(template: Template) {
		const firstTransform = template.transformations.find((t) => t.enabled);
		if (!firstTransform) return FileText;

		switch (firstTransform.type) {
			case 'wrap_code_block':
				return Code;
			case 'add_prefix':
			case 'add_suffix':
				return List;
			case 'trim_lines':
			case 'remove_blank_lines':
			case 'dedent':
				return Scissors;
			case 'to_uppercase':
			case 'to_lowercase':
				return Type;
			case 'number_lines':
				return Hash;
			default:
				return FileText;
		}
	}

	// Generate example preview
	function getExamplePreview(template: Template): { input: string; output: string } {
		const input = template.exampleText || 'lorem ipsum\n\ndolor sit amet';
		try {
			const output = applyTransformations(input, template.transformations);
			return { input, output };
		} catch {
			return { input, output: '(preview error)' };
		}
	}

	async function handleClick() {
		if (isProcessing) return;

		// For Firefox, show the paste modal instead of trying to read clipboard
		if (needsPasteWorkaround() && onFirefoxPaste) {
			onFirefoxPaste(template);
			return;
		}

		isProcessing = true;

		try {
			// Read clipboard
			const input = await readClipboard();

			if (!input.trim()) {
				toast.warning('Clipboard is empty');
				isProcessing = false;
				return;
			}

			// Apply transformation
			const output = applyTransformations(input, template.transformations);

			// Copy result to clipboard
			const copied = await copyWithFallback(output);

			// Update usage stats
			templateStore.incrementUsageCount(template.id);
			recentTemplatesStore.add(template.id);

			// Notify parent
			onTransform({ input, output, template });

			// Show success toast
			if (copied) {
				toast.success(`Transformed and copied!`);
			} else {
				toast.info('Transformed! Click Copy to copy result.');
			}
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error('Failed to transform');
			}
		} finally {
			isProcessing = false;
		}
	}

	const IconComponent = $derived(getIcon(template));
	const example = $derived(getExamplePreview(template));
</script>

<button
	bind:this={cardRef}
	type="button"
	onclick={handleClick}
	onmouseenter={() => (isHovered = true)}
	onmouseleave={() => (isHovered = false)}
	disabled={isProcessing}
	class="template-card group relative flex flex-col items-center justify-center gap-2 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-wait min-w-30 min-h-25"
>
	<!-- Icon -->
	<div class="text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
		<IconComponent size={24} />
	</div>

	<!-- Name -->
	<span class="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 text-center line-clamp-2">
		{template.name}
	</span>
</button>

<!-- Hover preview popover -->
<Popover trigger={cardRef} show={isHovered && !isProcessing}>
	<div class="text-xs">
		<div class="font-medium text-gray-700 dark:text-gray-300 mb-2">Preview</div>
		<div class="grid grid-cols-2 gap-2">
			<div class="bg-gray-50 dark:bg-gray-900 p-2 rounded font-mono whitespace-pre-wrap max-h-32 overflow-auto text-gray-900 dark:text-gray-100">
				{example.input}
			</div>
			<div class="bg-green-50 dark:bg-green-900/20 p-2 rounded font-mono whitespace-pre-wrap max-h-32 overflow-auto text-gray-900 dark:text-gray-100">
				{example.output}
			</div>
		</div>
	</div>
</Popover>

<style>
	/* Smooth hover lift with shadow - uses spring-like curve for natural feel */
	.template-card {
		transition:
			transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
			box-shadow 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.template-card:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
	}

	/* Quick press feedback - fast down, spring back up */
	.template-card:active:not(:disabled) {
		transform: scale(0.97) translateY(0);
		transition-duration: 0.08s;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 2px 4px -1px rgba(0, 0, 0, 0.1);
	}

	/* Accessibility: respect reduced motion */
	@media (prefers-reduced-motion: reduce) {
		.template-card {
			transition: box-shadow 0.15s ease;
		}
		.template-card:hover:not(:disabled) {
			transform: none;
		}
		.template-card:active:not(:disabled) {
			transform: none;
		}
	}
</style>
