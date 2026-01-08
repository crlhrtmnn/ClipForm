<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { templateStore } from '$lib/stores/templateStore';
	import { toast, uiStore } from '$lib/stores/uiStore';
	import { applyTransformations } from '$lib/services/transformEngine';
	import { generateDiff } from '$lib/services/diffGenerator';
	import type { Transformation, Template } from '$lib/types/template';
	import TransformationBuilder from '$lib/components/templates/TransformationBuilder.svelte';
	import { ArrowLeft, Save, Trash2 } from 'lucide-svelte';

	const templateId = $derived($page.params.id);
	let template = $state<Template | undefined>(undefined);

	let name = $state('');
	let description = $state('');
	let category = $state('General');
	let tagsInput = $state('');
	let exampleText = $state('');
	let transformations = $state<Transformation[]>([]);
	let sampleInput = $state('');
	let transformedOutput = $state('');
	let showDiff = $state(false);

	// Load template on mount
	onMount(() => {
		template = templateStore.getById(templateId);
		if (!template) {
			toast.error('Template not found');
			goto('/templates');
			return;
		}

		// Populate form
		name = template.name;
		description = template.description;
		category = template.category || 'General';
		tagsInput = template.tags?.join(', ') || '';
		exampleText = template.exampleText || '';
		transformations = [...template.transformations];
	});

	// Auto-transform sample text when transformations change
	let debounceTimeout: NodeJS.Timeout | null = null;
	$effect(() => {
		if (sampleInput.trim() && transformations.length > 0) {
			if (debounceTimeout) {
				clearTimeout(debounceTimeout);
			}

			debounceTimeout = setTimeout(() => {
				try {
					transformedOutput = applyTransformations(sampleInput, transformations);
				} catch (error) {
					transformedOutput = `Error: ${(error as Error).message}`;
				}
			}, 300);
		} else {
			transformedOutput = '';
		}

		return () => {
			if (debounceTimeout) {
				clearTimeout(debounceTimeout);
			}
		};
	});

	function handleSave() {
		if (!name.trim()) {
			toast.error('Template name is required');
			return;
		}

		if (transformations.length === 0) {
			toast.error('Add at least one transformation');
			return;
		}

		const tags = tagsInput
			.split(',')
			.map((t) => t.trim())
			.filter((t) => t.length > 0);

		templateStore.update(templateId, {
			name: name.trim(),
			description: description.trim(),
			category: category.trim(),
			tags,
			exampleText: exampleText.trim() || undefined,
			transformations
		});

		toast.success('Template updated successfully!');
		goto('/templates');
	}

	function handleDelete() {
		if (!template) return;

		uiStore.showModal(
			'Delete Template',
			`Are you sure you want to delete "${template.name}"? This action cannot be undone.`,
			() => {
				templateStore.delete(templateId);
				toast.success('Template deleted');
				goto('/templates');
			}
		);
	}

	function handleCancel() {
		goto('/templates');
	}

	const diff = $derived(
		sampleInput && transformedOutput ? generateDiff(sampleInput, transformedOutput) : null
	);
</script>

<div class="max-w-7xl mx-auto">
	<!-- Header -->
	<div class="flex items-center justify-between mb-6">
		<div class="flex items-center gap-4">
			<button
				onclick={handleCancel}
				class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
				aria-label="Go back"
			>
				<ArrowLeft size={24} />
			</button>
			<div>
				<h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">Edit Template</h1>
				<p class="text-gray-600 dark:text-gray-400 mt-1">Modify transformations and test with live preview</p>
			</div>
		</div>
		<div class="flex items-center gap-2">
			<button
				onclick={handleDelete}
				class="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
			>
				<Trash2 size={18} />
				Delete
			</button>
			<button
				onclick={handleSave}
				class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
			>
				<Save size={18} />
				Save Changes
			</button>
		</div>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<!-- Left Column: Configuration -->
		<div class="space-y-6">
			<!-- Template Metadata -->
			<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
				<h2 class="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Template Information</h2>

				<div class="space-y-4">
					<div>
						<label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
							Name <span class="text-red-500">*</span>
						</label>
						<input
							id="name"
							type="text"
							bind:value={name}
							placeholder="e.g., Format Grafana Errors"
							class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
							required
						/>
					</div>

					<div>
						<label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
							Description
						</label>
						<textarea
							id="description"
							bind:value={description}
							placeholder="Brief description of what this template does..."
							rows="2"
							class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
						></textarea>
					</div>

					<div>
						<label for="category" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
							Category
						</label>
						<input
							id="category"
							type="text"
							bind:value={category}
							placeholder="e.g., Logging, Markdown"
							class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
						/>
					</div>

					<div>
						<label for="tags" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
							Tags (comma-separated)
						</label>
						<input
							id="tags"
							type="text"
							bind:value={tagsInput}
							placeholder="e.g., grafana, errors, logs"
							class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
						/>
					</div>

					<!-- Example Text -->
					<div>
						<label for="exampleText" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
							Preview Example Text
						</label>
						<textarea
							id="exampleText"
							bind:value={exampleText}
							placeholder="e.g., lorem ipsum&#10;&#10;dolor sit amet"
							rows="3"
							class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-sm"
						></textarea>
						<p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
							This text will be shown in the hover preview on the main page
						</p>
					</div>
				</div>
			</div>

			<!-- Transformations -->
			<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
				<h2 class="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Transformations</h2>
				<TransformationBuilder
					bind:transformations
					ontransformationschange={(t) => (transformations = t)}
				/>
			</div>
		</div>

		<!-- Right Column: Live Preview -->
		<div class="space-y-6">
			<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
				<h2 class="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Test with Sample Text</h2>
				<textarea
					bind:value={sampleInput}
					placeholder="Paste sample text here to see live preview..."
					rows="10"
					class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-sm"
				></textarea>
			</div>

			{#if transformedOutput}
				<div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
					<div class="flex items-center justify-between mb-4">
						<h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Preview Output</h2>
						<label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
							<input type="checkbox" bind:checked={showDiff} class="rounded" />
							Show Diff
						</label>
					</div>

					{#if showDiff && diff}
						<div class="grid grid-cols-2 gap-4">
							<div>
								<h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Original</h3>
								<div
									class="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded p-3 font-mono text-xs overflow-auto max-h-96 text-gray-900 dark:text-gray-100"
								>
									{#each diff.original as line}
										<div
											class="whitespace-pre-wrap {line.type === 'removed'
												? 'bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-300'
												: ''}"
										>
											{line.content || ' '}
										</div>
									{/each}
								</div>
							</div>

							<div>
								<h3 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Transformed</h3>
								<div
									class="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded p-3 font-mono text-xs overflow-auto max-h-96 text-gray-900 dark:text-gray-100"
								>
									{#each diff.transformed as line}
										<div
											class="whitespace-pre-wrap {line.type === 'added'
												? 'bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-300'
												: ''}"
										>
											{line.content || ' '}
										</div>
									{/each}
								</div>
							</div>
						</div>
					{:else}
						<div
							class="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded p-4 font-mono text-sm whitespace-pre-wrap overflow-auto max-h-96 text-gray-900 dark:text-gray-100"
						>
							{transformedOutput}
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>
