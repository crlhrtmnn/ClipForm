<script lang="ts">
	import { templateStore, starredTemplates, recentTemplates, recentTemplatesStore } from '$lib/stores/templateStore';
	import { toast } from '$lib/stores/uiStore';
	import { readClipboard, copyWithFallback, needsPasteWorkaround } from '$lib/services/clipboardService';
	import { applyTransformations } from '$lib/services/transformEngine';
	import type { Template } from '$lib/types/template';
	import { Plus, Settings, RotateCcw, Command } from 'lucide-svelte';
	import TemplateCard from '$lib/components/ui/TemplateCard.svelte';
	import CommandPalette from '$lib/components/ui/CommandPalette.svelte';
	import ResultArea from '$lib/components/ui/ResultArea.svelte';
	import FirefoxPasteModal from '$lib/components/ui/FirefoxPasteModal.svelte';

	// State
	let isPaletteOpen = $state(false);
	let lastUsedTemplate = $state<Template | null>(null);
	let resultVisible = $state(false);
	let resultInput = $state('');
	let resultOutput = $state('');
	let resultTemplateName = $state('');
	let isRepeatProcessing = $state(false);

	// Firefox paste modal state
	let firefoxPasteModalOpen = $state(false);
	let firefoxPasteTemplate = $state<Template | null>(null);

	// Get all templates
	const allTemplates = $derived($templateStore);

	// Handle transformation result from TemplateCard or CommandPalette
	function handleTransformResult(result: { input: string; output: string; template: Template }) {
		lastUsedTemplate = result.template;
		resultInput = result.input;
		resultOutput = result.output;
		resultTemplateName = result.template.name;
		resultVisible = true;
	}

	// Handle Firefox paste modal open request
	function handleFirefoxPaste(template: Template) {
		firefoxPasteTemplate = template;
		firefoxPasteModalOpen = true;
	}

	// Handle paste from Firefox modal
	async function handleFirefoxPasteSubmit(input: string) {
		if (!firefoxPasteTemplate) return;

		const template = firefoxPasteTemplate;

		// Close modal immediately for better UX
		firefoxPasteModalOpen = false;

		try {
			// Apply transformation
			const output = applyTransformations(input, template.transformations);

			// Copy result to clipboard
			const copied = await copyWithFallback(output);

			// Update usage stats
			templateStore.incrementUsageCount(template.id);
			recentTemplatesStore.add(template.id);

			// Update result area
			lastUsedTemplate = template;
			resultInput = input;
			resultOutput = output;
			resultTemplateName = template.name;
			resultVisible = true;

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
		}

		firefoxPasteTemplate = null;
	}

	// Close Firefox paste modal
	function closeFirefoxPasteModal() {
		firefoxPasteModalOpen = false;
		firefoxPasteTemplate = null;
	}

	// Repeat last transformation
	async function repeatLastTransformation() {
		if (!lastUsedTemplate || isRepeatProcessing) return;

		// For Firefox, show the paste modal
		if (needsPasteWorkaround()) {
			firefoxPasteTemplate = lastUsedTemplate;
			firefoxPasteModalOpen = true;
			return;
		}

		isRepeatProcessing = true;

		try {
			// Read clipboard
			const input = await readClipboard();

			if (!input.trim()) {
				toast.warning('Clipboard is empty');
				isRepeatProcessing = false;
				return;
			}

			// Apply transformation
			const output = applyTransformations(input, lastUsedTemplate.transformations);

			// Copy result to clipboard
			const copied = await copyWithFallback(output);

			// Update usage stats
			templateStore.incrementUsageCount(lastUsedTemplate.id);
			recentTemplatesStore.add(lastUsedTemplate.id);

			// Update result area
			resultInput = input;
			resultOutput = output;
			resultTemplateName = lastUsedTemplate.name;
			resultVisible = true;

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
			isRepeatProcessing = false;
		}
	}

	// Hide result area
	function hideResult() {
		resultVisible = false;
	}

	// Keyboard shortcuts
	function handleKeyDown(e: KeyboardEvent) {
		// Cmd+K or Ctrl+K to open palette
		if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
			e.preventDefault();
			isPaletteOpen = true;
		}

		// Cmd+Enter or Ctrl+Enter to repeat last
		if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && lastUsedTemplate) {
			e.preventDefault();
			repeatLastTransformation();
		}

		// Escape to hide result or close palette
		if (e.key === 'Escape') {
			if (isPaletteOpen) {
				isPaletteOpen = false;
			} else if (resultVisible) {
				resultVisible = false;
			}
		}
	}

	// Check for last used template from recent templates on mount
	$effect(() => {
		if (!lastUsedTemplate && $recentTemplates.length > 0) {
			lastUsedTemplate = $recentTemplates[0];
		}
	});

	// Platform detection for keyboard shortcut display
	const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
	const modKey = isMac ? '⌘' : 'Ctrl';
</script>

<svelte:window onkeydown={handleKeyDown} />

<div class="max-w-4xl mx-auto">
	<!-- Header -->
	<div class="flex items-center justify-between mb-8">
		<div>
			<h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">ClipForm</h1>
			<p class="text-gray-500 dark:text-gray-400 text-sm">
				Click a template to transform clipboard text instantly
			</p>
		</div>
	</div>

	<!-- Repeat Last Bar -->
	{#if lastUsedTemplate}
		<div class="mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					<RotateCcw size={18} class="text-gray-400 dark:text-gray-500" />
					<div>
						<span class="text-sm text-gray-500 dark:text-gray-400">Repeat last:</span>
						<span class="text-sm font-medium text-gray-900 dark:text-gray-100 ml-1">{lastUsedTemplate.name}</span>
					</div>
				</div>

				<button
					onclick={repeatLastTransformation}
					disabled={isRepeatProcessing}
					class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-wait transition-colors"
				>
					{#if isRepeatProcessing}
						<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
						Processing...
					{:else}
						Apply
						<kbd class="ml-1 px-1.5 py-0.5 bg-blue-500 rounded text-xs">{modKey}+Enter</kbd>
					{/if}
				</button>
			</div>
		</div>
	{/if}

	<!-- Starred Templates Section -->
	{#if $starredTemplates.length > 0}
		<div class="mb-8">
			<h2 class="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
				Your Templates
			</h2>

			<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
				{#each $starredTemplates as template (template.id)}
					<TemplateCard {template} onTransform={handleTransformResult} onFirefoxPaste={handleFirefoxPaste} />
				{/each}
			</div>
		</div>
	{:else}
		<!-- Empty state -->
		<div class="mb-8 p-8 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 text-center">
			<p class="text-gray-500 dark:text-gray-400 mb-4">
				No starred templates yet. Star your favorites for quick access!
			</p>
			<div class="flex items-center justify-center gap-4">
				<a
					href="/templates"
					class="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
				>
					Browse Templates
				</a>
				<button
					onclick={() => isPaletteOpen = true}
					class="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
				>
					Search ({modKey}+K)
				</button>
			</div>
		</div>
	{/if}

	
	<!-- Result Area -->
	<ResultArea
	visible={resultVisible}
	templateName={resultTemplateName}
	input={resultInput}
	output={resultOutput}
	onHide={hideResult}
	/>
	<!-- Search Hint -->
	<div class="m-8 text-center">
		<button
			onclick={() => isPaletteOpen = true}
			class="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
		>
			<Command size={16} />
			Press <kbd class="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs font-medium">{modKey}+K</kbd> to search all templates
		</button>
	</div>

	<!-- Command Palette -->
	<CommandPalette
		open={isPaletteOpen}
		templates={allTemplates}
		onClose={() => isPaletteOpen = false}
		onTransform={handleTransformResult}
		onFirefoxPaste={handleFirefoxPaste}
	/>

	<!-- Firefox Paste Modal -->
	<FirefoxPasteModal
		open={firefoxPasteModalOpen}
		template={firefoxPasteTemplate}
		onPaste={handleFirefoxPasteSubmit}
		onClose={closeFirefoxPasteModal}
	/>
</div>
