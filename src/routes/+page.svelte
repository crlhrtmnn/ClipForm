<script lang="ts">
	import { onMount } from 'svelte';
	import { templateStore, starredTemplates, recentTemplatesStore } from '$lib/stores/templateStore';
	import { clipboardStore, canAutoRead, canWrite } from '$lib/stores/clipboardStore';
	import { toast } from '$lib/stores/uiStore';
	import { readClipboard, writeClipboard, copyWithFallback } from '$lib/services/clipboardService';
	import { applyTransformations } from '$lib/services/transformEngine';
	import type { Template } from '$lib/types/template';
	import { Search, Copy, Clipboard, Star } from 'lucide-svelte';

	let searchQuery = $state('');
	let selectedTemplate = $state<Template | null>(null);
	let inputText = $state('');
	let outputText = $state('');
	let isProcessing = $state(false);
	let lastProcessedInput = $state('');

	// Get filtered templates based on search
	$effect(() => {
		if (searchQuery.trim()) {
			filteredTemplates = templateStore.search(searchQuery);
		} else {
			filteredTemplates = $templateStore;
		}
	});

	let filteredTemplates = $state<Template[]>($templateStore);

	// Auto-transform when input text changes (with debounce)
	let debounceTimeout: NodeJS.Timeout | null = null;
	$effect(() => {
		// Only auto-process if we have both template and text, and text has changed
		if (selectedTemplate && inputText.trim() && inputText !== lastProcessedInput && !isProcessing) {
			if (debounceTimeout) {
				clearTimeout(debounceTimeout);
			}

			// Debounce for 300ms to avoid processing while user is still typing/pasting
			debounceTimeout = setTimeout(() => {
				processText();
			}, 300);
		}

		// Cleanup
		return () => {
			if (debounceTimeout) {
				clearTimeout(debounceTimeout);
			}
		};
	});

	// Auto-read clipboard when template is selected (if permission granted)
	async function selectTemplate(template: Template) {
		selectedTemplate = template;

		if ($canAutoRead && $clipboardStore.mode === 'auto') {
			try {
				inputText = await readClipboard();
				await processText();
			} catch (error) {
				toast.error((error as Error).message);
				// Fall back to manual paste
			}
		}
	}

	// Process text through selected template
	async function processText() {
		if (!selectedTemplate || !inputText.trim()) {
			toast.error('Please select a template and enter text');
			return;
		}

		isProcessing = true;

		try {
			// Apply transformations
			outputText = applyTransformations(inputText, selectedTemplate.transformations);

			// Track what we just processed
			lastProcessedInput = inputText;

			// Increment usage count
			templateStore.incrementUsageCount(selectedTemplate.id);

			// Add to recent
			recentTemplatesStore.add(selectedTemplate.id);

			// Auto-copy if enabled
			if ($clipboardStore.capabilities?.autoCopyResult !== false) {
				const copied = await copyWithFallback(outputText);
				if (copied) {
					toast.success('Transformed and copied to clipboard!');
				} else {
					toast.success('Text transformed! Click Copy to copy result.');
				}
			} else {
				toast.success('Text transformed successfully!');
			}
		} catch (error) {
			toast.error('Error processing text: ' + (error as Error).message);
		} finally {
			isProcessing = false;
		}
	}

	// Manual copy
	async function copyOutput() {
		if (!outputText.trim()) {
			toast.error('No output to copy');
			return;
		}

		try {
			const success = await copyWithFallback(outputText);
			if (success) {
				toast.success('Copied to clipboard!');
			} else {
				toast.error('Failed to copy to clipboard');
			}
		} catch (error) {
			toast.error('Failed to copy: ' + (error as Error).message);
		}
	}

	// Clear all
	function clear() {
		inputText = '';
		outputText = '';
		selectedTemplate = null;
	}
</script>

<div class="max-w-6xl mx-auto">
	<div class="mb-8">
		<h1 class="text-3xl font-bold text-gray-900 mb-2">Text Converter</h1>
		<p class="text-gray-600">
			Select a template to quickly transform your text. {$canAutoRead
				? 'Text will be auto-read from clipboard.'
				: 'Paste your text manually.'}
		</p>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
		<!-- Template Selector -->
		<div class="lg:col-span-1">
			<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
				<h2 class="text-lg font-semibold mb-4">Select Template</h2>

				<!-- Search -->
				<div class="relative mb-4">
					<Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search templates..."
						class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					/>
				</div>

				<!-- Starred Templates -->
				{#if $starredTemplates.length > 0 && !searchQuery}
					<div class="mb-4">
						<h3 class="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
							<Star size={14} class="fill-yellow-400 text-yellow-400" />
							Starred
						</h3>
						<div class="space-y-1">
							{#each $starredTemplates as template}
								<button
									onclick={() => selectTemplate(template)}
									class="w-full text-left px-3 py-2 rounded-md text-sm {selectedTemplate?.id ===
									template.id
										? 'bg-blue-100 text-blue-700'
										: 'hover:bg-gray-100 text-gray-700'}"
								>
									<div class="font-medium">{template.name}</div>
									<div class="text-xs text-gray-500">{template.description}</div>
								</button>
							{/each}
						</div>
					</div>
				{/if}

				<!-- All Templates -->
				<div>
					<h3 class="text-sm font-medium text-gray-700 mb-2">
						{searchQuery ? 'Search Results' : 'All Templates'}
					</h3>
					<div class="space-y-1 max-h-96 overflow-y-auto">
						{#each filteredTemplates as template}
							<button
								onclick={() => selectTemplate(template)}
								class="w-full text-left px-3 py-2 rounded-md text-sm {selectedTemplate?.id ===
								template.id
									? 'bg-blue-100 text-blue-700'
									: 'hover:bg-gray-100 text-gray-700'}"
							>
								<div class="flex items-center justify-between">
									<div class="font-medium">{template.name}</div>
									{#if template.starred}
										<Star size={14} class="fill-yellow-400 text-yellow-400" />
									{/if}
								</div>
								<div class="text-xs text-gray-500">{template.description}</div>
							</button>
						{:else}
							<p class="text-sm text-gray-500 py-4 text-center">No templates found</p>
						{/each}
					</div>
				</div>
			</div>
		</div>

		<!-- Input/Output -->
		<div class="lg:col-span-2 space-y-4">
			<!-- Input -->
			<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
				<div class="flex items-center justify-between mb-2">
					<h2 class="text-lg font-semibold">Input</h2>
					<button
						onclick={async () => {
							try {
								inputText = await readClipboard();
								toast.success('Text pasted from clipboard');
							} catch (error) {
								toast.error('Failed to read clipboard');
							}
						}}
						class="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
					>
						<Clipboard size={16} />
						Paste
					</button>
				</div>
				<textarea
					bind:value={inputText}
					placeholder="Paste or type your text here..."
					class="w-full h-48 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
				></textarea>
			</div>

			<!-- Action Buttons -->
			<div class="flex items-center gap-2">
				<button
					onclick={processText}
					disabled={!selectedTemplate || !inputText.trim() || isProcessing}
					class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
				>
					{isProcessing ? 'Processing...' : 'Transform'}
				</button>
				<button
					onclick={clear}
					class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
				>
					Clear
				</button>
			</div>

			<!-- Output -->
			{#if outputText}
				<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
					<div class="flex items-center justify-between mb-2">
						<h2 class="text-lg font-semibold">Output</h2>
						<button
							onclick={copyOutput}
							class="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
						>
							<Copy size={16} />
							Copy
						</button>
					</div>
					<div
						class="w-full min-h-48 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm whitespace-pre-wrap"
					>
						{outputText}
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
