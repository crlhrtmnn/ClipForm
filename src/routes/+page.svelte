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

		// Escape to hide result (palette handles its own escape)
		if (e.key === 'Escape') {
			if (resultVisible && !isPaletteOpen) {
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

<div class="max-w-4xl mx-auto pt-8">
	<!-- Hero Header -->
	<div class="relative mb-16 text-center">
		<!-- Refined blue backdrop glow -->
		<div class="absolute -top-48 left-1/2 -translate-x-1/2 w-[1700px] h-[1200px] pointer-events-none">
			<div class="absolute inset-0 bg-linear-to-b from-blue-400/15 to-transparent rounded-[100%] blur-[80px]"></div>
		</div>
		
		<div class="relative">
			<div class="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 rounded-full border border-blue-200 dark:border-blue-500/20">
				<span class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
				Ready to transform
			</div>
			<h1 class="text-4xl sm:text-5xl font-bold mb-4">
				<span class="text-gray-900 dark:text-gray-100">Clip</span><span class="wobble-text">Form</span>
			</h1>
			<p class="text-gray-500 dark:text-gray-400 text-lg max-w-md mx-auto">
				Transform your clipboard text instantly with one click
			</p>
		</div>
	</div>

	<!-- Repeat Last Bar -->
	{#if lastUsedTemplate}
		<div class="mb-12 p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					<div class="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md shadow-blue-500/20">
						<RotateCcw size={16} class="text-white" />
					</div>
					<div>
						<span class="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Quick repeat</span>
						<p class="text-sm font-semibold text-gray-900 dark:text-gray-100">{lastUsedTemplate.name}</p>
					</div>
				</div>

				<button
					onclick={repeatLastTransformation}
					disabled={isRepeatProcessing}
					class="btn btn-primary btn-md"
				>
					{#if isRepeatProcessing}
						<div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
						Processing...
					{:else}
						Apply
						<kbd>{modKey}⏎</kbd>
					{/if}
				</button>
			</div>
		</div>
	{/if}

	<!-- Starred Templates Section -->
	{#if $starredTemplates.length > 0}
		<div class="mb-14">
			<div class="flex items-center gap-2 mb-6">
				<div class="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"></div>
				<h2 class="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-3">
					Your Templates
				</h2>
				<div class="h-px flex-1 bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"></div>
			</div>

			<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
				{#each $starredTemplates as template (template.id)}
					<TemplateCard {template} onTransform={handleTransformResult} onFirefoxPaste={handleFirefoxPaste} />
				{/each}
			</div>
		</div>
	{:else}
		<!-- Empty state -->
		<div class="mb-14 p-12 relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
			<!-- Decorative elements -->
			<div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl"></div>
			<div class="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-500/10 to-orange-500/10 rounded-full blur-2xl"></div>
			
			<div class="relative text-center">
				<div class="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-200/50 dark:border-blue-500/20">
					<Plus size={28} class="text-blue-500 dark:text-blue-400" />
				</div>
				<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Get started with templates</h3>
				<p class="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
					Star your favorite templates for quick access, or browse all available transformations.
				</p>
				<div class="flex items-center justify-center gap-3">
					<a
						href="/templates"
						class="btn btn-primary btn-md"
					>
						Browse Templates
					</a>
					<button
						onclick={() => isPaletteOpen = true}
						class="btn btn-secondary btn-md"
					>
						<Command size={14} />
						Quick Search
					</button>
				</div>
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
	<div class="mt-14 text-center">
		<button
			onclick={() => isPaletteOpen = true}
			class="btn btn-secondary btn-md group"
		>
			<Command size={15} class="text-gray-400 group-hover:text-blue-500 transition-colors" />
			<span>Press</span>
			<kbd>{modKey}+K</kbd>
			<span>to search all templates</span>
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
