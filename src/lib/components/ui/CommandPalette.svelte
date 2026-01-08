<script lang="ts">
	import type { Template } from '$lib/types/template';
	import { applyTransformations } from '$lib/services/transformEngine';
	import { readClipboard, copyWithFallback, needsPasteWorkaround } from '$lib/services/clipboardService';
	import { templateStore, recentTemplatesStore } from '$lib/stores/templateStore';
	import { toast } from '$lib/stores/uiStore';
	import { Search, Star, Folder, X } from 'lucide-svelte';
	import { tick } from 'svelte';

	interface Props {
		open: boolean;
		templates: Template[];
		onClose: () => void;
		onTransform: (result: { input: string; output: string; template: Template }) => void;
		onFirefoxPaste?: (template: Template) => void;
	}

	let { open, templates, onClose, onTransform, onFirefoxPaste }: Props = $props();

	let searchQuery = $state('');
	let selectedIndex = $state(0);
	let searchInputRef = $state<HTMLInputElement | null>(null);
	let isProcessing = $state(false);

	// Group templates by category with starred first
	function getGroupedTemplates(templates: Template[], query: string) {
		let filtered = templates;

		if (query.trim()) {
			const lowerQuery = query.toLowerCase();
			filtered = templates.filter(
				(t) =>
					t.name.toLowerCase().includes(lowerQuery) ||
					t.description.toLowerCase().includes(lowerQuery) ||
					t.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
			);
		}

		// Group by starred first, then by category
		const starred = filtered.filter((t) => t.starred).sort((a, b) => b.usageCount - a.usageCount);
		const unstarred = filtered.filter((t) => !t.starred);

		// Group unstarred by category
		const byCategory = new Map<string, Template[]>();
		for (const template of unstarred) {
			const category = template.category || 'Other';
			if (!byCategory.has(category)) {
				byCategory.set(category, []);
			}
			byCategory.get(category)!.push(template);
		}

		// Sort categories and templates within
		const categories = Array.from(byCategory.keys()).sort();
		const groups: { name: string; templates: Template[]; isStarred?: boolean }[] = [];

		if (starred.length > 0) {
			groups.push({ name: 'Starred', templates: starred, isStarred: true });
		}

		for (const category of categories) {
			const categoryTemplates = byCategory.get(category)!;
			categoryTemplates.sort((a, b) => b.usageCount - a.usageCount);
			groups.push({ name: category, templates: categoryTemplates });
		}

		return groups;
	}

	// Flatten grouped templates for keyboard navigation
	function getFlatList(groups: ReturnType<typeof getGroupedTemplates>) {
		return groups.flatMap((g) => g.templates);
	}

	const groupedTemplates = $derived(getGroupedTemplates(templates, searchQuery));
	const flatList = $derived(getFlatList(groupedTemplates));

	// Reset selection when search changes
	$effect(() => {
		searchQuery;
		selectedIndex = 0;
	});

	// Focus search input when opened
	$effect(() => {
		if (open) {
			tick().then(() => {
				searchInputRef?.focus();
			});
			searchQuery = '';
			selectedIndex = 0;
		}
	});

	function handleKeyDown(e: KeyboardEvent) {
		if (!open) return;

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				selectedIndex = Math.min(selectedIndex + 1, flatList.length - 1);
				break;
			case 'ArrowUp':
				e.preventDefault();
				selectedIndex = Math.max(selectedIndex - 1, 0);
				break;
			case 'Enter':
				e.preventDefault();
				if (flatList[selectedIndex]) {
					selectTemplate(flatList[selectedIndex]);
				}
				break;
			case 'Escape':
				e.preventDefault();
				onClose();
				break;
		}
	}

	async function selectTemplate(template: Template) {
		if (isProcessing) return;

		// For Firefox, delegate to parent and show paste modal
		if (needsPasteWorkaround() && onFirefoxPaste) {
			onClose();
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

			// Close palette
			onClose();

			// Notify parent
			onTransform({ input, output, template });

			// Show success toast
			if (copied) {
				toast.success(`Transformed with "${template.name}" and copied!`);
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

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			onClose();
		}
	}

	// Track cumulative index for highlighting
	function getTemplateIndex(groups: typeof groupedTemplates, groupIndex: number, templateIndex: number): number {
		let index = 0;
		for (let i = 0; i < groupIndex; i++) {
			index += groups[i].templates.length;
		}
		return index + templateIndex;
	}
</script>

<svelte:window onkeydown={handleKeyDown} />

{#if open}
	<!-- Backdrop -->
	<!-- svelte-ignore a11y_click_events_have_key_events a11y_interactive_supports_focus -->
	<!-- svelte-ignore a11y_interactive_supports_focus -->
	<div
		class="palette-backdrop fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
		onclick={handleBackdropClick}
		role="dialog"
		aria-modal="true"
		aria-label="Command palette"
	>
		<!-- Palette -->
		<div class="palette-container bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
			<!-- Search input -->
			<div class="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
				<Search size={20} class="text-gray-400 dark:text-gray-500 shrink-0" />
				<input
					bind:this={searchInputRef}
					bind:value={searchQuery}
					type="text"
					placeholder="Search templates..."
					class="flex-1 text-base outline-none bg-transparent placeholder-gray-400 dark:placeholder-gray-500 text-gray-900 dark:text-gray-100"
				/>
				<button
					type="button"
					onclick={onClose}
					class="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 rounded"
				>
					<X size={18} />
				</button>
			</div>

			<!-- Results -->
			<div class="max-h-100 overflow-y-auto">
				{#if flatList.length === 0}
					<div class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
						No templates found
					</div>
				{:else}
					{#each groupedTemplates as group, groupIndex}
						<!-- Category header -->
						<div class="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-900 sticky top-0 flex items-center gap-2">
							{#if group.isStarred}
								<Star size={12} class="fill-yellow-400 text-yellow-400" />
							{:else}
								<Folder size={12} />
							{/if}
							{group.name}
						</div>

						<!-- Templates in group -->
						{#each group.templates as template, templateIndex}
							{@const absoluteIndex = getTemplateIndex(groupedTemplates, groupIndex, templateIndex)}
							<button
								type="button"
								onclick={() => selectTemplate(template)}
								class="w-full px-4 py-2.5 flex items-center gap-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors {absoluteIndex === selectedIndex ? 'bg-blue-50 dark:bg-blue-900/30' : ''}"
							>
								<span class="flex-1 text-sm font-medium text-gray-700 dark:text-gray-300">
									{template.name}
								</span>
								{#if template.usageCount > 0}
									<span class="text-xs text-gray-400 dark:text-gray-500">
										{template.usageCount} uses
									</span>
								{/if}
							</button>
						{/each}
					{/each}
				{/if}
			</div>

			<!-- Footer hint -->
			<div class="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-4">
				<span><kbd class="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">↑↓</kbd> navigate</span>
				<span><kbd class="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">Enter</kbd> apply</span>
				<span><kbd class="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">Esc</kbd> close</span>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Backdrop fade in */
	.palette-backdrop {
		background-color: rgba(0, 0, 0, 0.5);
		animation: backdrop-fade-in 0.2s ease-out;
	}

	@keyframes backdrop-fade-in {
		from {
			background-color: rgba(0, 0, 0, 0);
		}
		to {
			background-color: rgba(0, 0, 0, 0.5);
		}
	}

	/* Palette container slides down with gentle spring */
	.palette-container {
		animation: palette-enter 0.25s cubic-bezier(0.16, 1, 0.3, 1);
		transform-origin: top center;
	}

	@keyframes palette-enter {
		from {
			opacity: 0;
			transform: scale(0.96) translateY(-8px);
		}
		to {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}

	/* Accessibility: respect reduced motion */
	@media (prefers-reduced-motion: reduce) {
		.palette-backdrop {
			animation: none;
		}
		.palette-container {
			animation: none;
		}
	}
</style>
