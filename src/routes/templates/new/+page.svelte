<script lang="ts">
	import { goto } from '$app/navigation';
	import { templateStore } from '$lib/stores/templateStore';
	import { toast } from '$lib/stores/uiStore';
	import { applyTransformations } from '$lib/services/transformEngine';
	import { generateDiff } from '$lib/services/diffGenerator';
	import type { Transformation } from '$lib/types/template';
	import TransformationBuilder from '$lib/components/templates/TransformationBuilder.svelte';
	import { ArrowLeft, Save } from 'lucide-svelte';

	let name = $state('');
	let description = $state('');
	let category = $state('General');
	let tagsInput = $state('');
	let transformations = $state<Transformation[]>([]);
	let sampleInput = $state('');
	let transformedOutput = $state('');
	let showDiff = $state(false);

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
		// Validation
		if (!name.trim()) {
			toast.error('Template name is required');
			return;
		}

		if (transformations.length === 0) {
			toast.error('Add at least one transformation');
			return;
		}

		// Parse tags
		const tags = tagsInput
			.split(',')
			.map((t) => t.trim())
			.filter((t) => t.length > 0);

		// Create template
		templateStore.create({
			name: name.trim(),
			description: description.trim(),
			category: category.trim(),
			tags,
			transformations,
			starred: false
		});

		toast.success('Template created successfully!');
		goto('/templates');
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
				class="text-gray-600 hover:text-gray-900"
				aria-label="Go back"
			>
				<ArrowLeft size={24} />
			</button>
			<div>
				<h1 class="text-3xl font-bold text-gray-900">Create New Template</h1>
				<p class="text-gray-600 mt-1">Define transformations and test with live preview</p>
			</div>
		</div>
		<button
			onclick={handleSave}
			class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
		>
			<Save size={18} />
			Save Template
		</button>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<!-- Left Column: Configuration -->
		<div class="space-y-6">
			<!-- Template Metadata -->
			<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<h2 class="text-lg font-semibold mb-4">Template Information</h2>

				<div class="space-y-4">
					<!-- Name -->
					<div>
						<label for="name" class="block text-sm font-medium text-gray-700 mb-1">
							Name <span class="text-red-500">*</span>
						</label>
						<input
							id="name"
							type="text"
							bind:value={name}
							placeholder="e.g., Format Grafana Errors"
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							required
						/>
					</div>

					<!-- Description -->
					<div>
						<label for="description" class="block text-sm font-medium text-gray-700 mb-1">
							Description
						</label>
						<textarea
							id="description"
							bind:value={description}
							placeholder="Brief description of what this template does..."
							rows="2"
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						></textarea>
					</div>

					<!-- Category -->
					<div>
						<label for="category" class="block text-sm font-medium text-gray-700 mb-1">
							Category
						</label>
						<input
							id="category"
							type="text"
							bind:value={category}
							placeholder="e.g., Logging, Markdown"
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					<!-- Tags -->
					<div>
						<label for="tags" class="block text-sm font-medium text-gray-700 mb-1">
							Tags (comma-separated)
						</label>
						<input
							id="tags"
							type="text"
							bind:value={tagsInput}
							placeholder="e.g., grafana, errors, logs"
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>
				</div>
			</div>

			<!-- Transformations -->
			<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<h2 class="text-lg font-semibold mb-4">Transformations</h2>
				<TransformationBuilder
					bind:transformations
					ontransformationschange={(t) => (transformations = t)}
				/>
			</div>
		</div>

		<!-- Right Column: Live Preview -->
		<div class="space-y-6">
			<!-- Sample Input -->
			<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
				<h2 class="text-lg font-semibold mb-4">Test with Sample Text</h2>
				<textarea
					bind:value={sampleInput}
					placeholder="Paste sample text here to see live preview..."
					rows="10"
					class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
				></textarea>
			</div>

			<!-- Output Preview -->
			{#if transformedOutput}
				<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
					<div class="flex items-center justify-between mb-4">
						<h2 class="text-lg font-semibold">Preview Output</h2>
						<label class="flex items-center gap-2 text-sm">
							<input type="checkbox" bind:checked={showDiff} class="rounded" />
							Show Diff
						</label>
					</div>

					{#if showDiff && diff}
						<!-- Diff View -->
						<div class="grid grid-cols-2 gap-4">
							<!-- Original -->
							<div>
								<h3 class="text-sm font-medium text-gray-700 mb-2">Original</h3>
								<div
									class="bg-gray-50 border border-gray-200 rounded p-3 font-mono text-xs overflow-auto max-h-96"
								>
									{#each diff.original as line}
										<div
											class="whitespace-pre-wrap {line.type === 'removed'
												? 'bg-red-100 text-red-900'
												: ''}"
										>
											{line.content || ' '}
										</div>
									{/each}
								</div>
							</div>

							<!-- Transformed -->
							<div>
								<h3 class="text-sm font-medium text-gray-700 mb-2">Transformed</h3>
								<div
									class="bg-gray-50 border border-gray-200 rounded p-3 font-mono text-xs overflow-auto max-h-96"
								>
									{#each diff.transformed as line}
										<div
											class="whitespace-pre-wrap {line.type === 'added'
												? 'bg-green-100 text-green-900'
												: ''}"
										>
											{line.content || ' '}
										</div>
									{/each}
								</div>
							</div>
						</div>
					{:else}
						<!-- Simple Output -->
						<div
							class="bg-gray-50 border border-gray-200 rounded p-4 font-mono text-sm whitespace-pre-wrap overflow-auto max-h-96"
						>
							{transformedOutput}
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>
