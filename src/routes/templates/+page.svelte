<script lang="ts">
	import { templateStore } from '$lib/stores/templateStore';
	import { uiStore, toast } from '$lib/stores/uiStore';
	import { exportTemplates, importTemplates } from '$lib/services/localStorage';
	import { Plus, Search, Download, Upload, Star, Edit, Trash2, Copy } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	let searchQuery = $state('');
	let selectedCategory = $state('');
	let filteredTemplates = $state($templateStore);

	// Filter templates based on search and category
	$effect(() => {
		let results = $templateStore;

		// Filter by search query
		if (searchQuery.trim()) {
			results = templateStore.search(searchQuery);
		}

		// Filter by category
		if (selectedCategory) {
			results = results.filter((t) => t.category === selectedCategory);
		}

		// Sort: starred first, then by usage count
		filteredTemplates = results.sort((a, b) => {
			if (a.starred && !b.starred) return -1;
			if (!a.starred && b.starred) return 1;
			return b.usageCount - a.usageCount;
		});
	});

	const categories = $derived(templateStore.getCategories());

	// Export templates
	function handleExport() {
		const json = exportTemplates($templateStore);
		const blob = new Blob([json], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `markdown-converter-templates-${new Date().toISOString().split('T')[0]}.json`;
		a.click();
		URL.revokeObjectURL(url);
		toast.success('Templates exported successfully!');
	}

	// Import templates
	async function handleImport() {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'application/json';
		input.onchange = async (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (!file) return;

			try {
				const text = await file.text();
				const imported = importTemplates(text);

				// Add imported templates to store
				imported.forEach((template) => {
					// Generate new ID to avoid conflicts
					const newId = `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
					templateStore.create({
						...template,
						name: template.name + ' (Imported)'
					});
				});

				toast.success(`Imported ${imported.length} template(s)!`);
			} catch (error) {
				toast.error('Failed to import: ' + (error as Error).message);
			}
		};
		input.click();
	}

	// Delete template with confirmation
	function handleDelete(id: string, name: string) {
		uiStore.showModal(
			'Delete Template',
			`Are you sure you want to delete "${name}"? This action cannot be undone.`,
			() => {
				templateStore.delete(id);
				toast.success('Template deleted');
			}
		);
	}

	// Duplicate template
	function handleDuplicate(id: string) {
		const newId = templateStore.duplicate(id);
		if (newId) {
			toast.success('Template duplicated!');
		}
	}
</script>

<div class="max-w-7xl mx-auto">
	<!-- Header -->
	<div class="flex items-center justify-between mb-6">
		<div>
			<h1 class="text-3xl font-bold text-gray-900">Templates</h1>
			<p class="text-gray-600 mt-1">Manage your text transformation templates</p>
		</div>
		<button
			onclick={() => goto('/templates/new')}
			class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
		>
			<Plus size={20} />
			New Template
		</button>
	</div>

	<!-- Search and Filters -->
	<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<!-- Search -->
			<div class="relative">
				<Search
					class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
					size={18}
				/>
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search templates..."
					class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
				/>
			</div>

			<!-- Category Filter -->
			<div>
				<select
					bind:value={selectedCategory}
					class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
				>
					<option value="">All Categories</option>
					{#each categories as category}
						<option value={category}>{category}</option>
					{/each}
				</select>
			</div>
		</div>

		<!-- Actions -->
		<div class="flex items-center gap-2 mt-4">
			<button
				onclick={handleExport}
				class="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
			>
				<Download size={16} />
				Export All
			</button>
			<button
				onclick={handleImport}
				class="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
			>
				<Upload size={16} />
				Import
			</button>
		</div>
	</div>

	<!-- Templates Grid -->
	{#if filteredTemplates.length === 0}
		<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
			<p class="text-gray-500 mb-4">No templates found</p>
			<button
				onclick={() => goto('/templates/new')}
				class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
			>
				<Plus size={18} />
				Create Your First Template
			</button>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each filteredTemplates as template (template.id)}
				<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
					<!-- Header -->
					<div class="flex items-start justify-between mb-3">
						<div class="flex-1">
							<div class="flex items-center gap-2">
								<h3 class="text-lg font-semibold text-gray-900">{template.name}</h3>
								{#if template.starred}
									<Star size={16} class="fill-yellow-400 text-yellow-400" />
								{/if}
							</div>
							{#if template.category}
								<span
									class="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded"
								>
									{template.category}
								</span>
							{/if}
						</div>
						<button
							onclick={() => templateStore.toggleStar(template.id)}
							class="text-gray-400 hover:text-yellow-400"
							aria-label="Toggle star"
						>
							<Star size={20} class={template.starred ? 'fill-yellow-400 text-yellow-400' : ''} />
						</button>
					</div>

					<!-- Description -->
					<p class="text-sm text-gray-600 mb-3">{template.description}</p>

					<!-- Metadata -->
					<div class="flex items-center gap-4 text-xs text-gray-500 mb-4">
						<span>{template.transformations.length} transformation(s)</span>
						<span>Used {template.usageCount} time(s)</span>
					</div>

					<!-- Tags -->
					{#if template.tags && template.tags.length > 0}
						<div class="flex flex-wrap gap-1 mb-4">
							{#each template.tags as tag}
								<span class="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">{tag}</span>
							{/each}
						</div>
					{/if}

					<!-- Actions -->
					<div class="flex items-center gap-2">
						<button
							onclick={() => goto(`/templates/${template.id}`)}
							class="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
						>
							<Edit size={14} />
							Edit
						</button>
						<button
							onclick={() => handleDuplicate(template.id)}
							class="flex items-center justify-center px-3 py-1.5 text-sm text-gray-600 bg-gray-50 rounded-md hover:bg-gray-100"
							title="Duplicate"
						>
							<Copy size={14} />
						</button>
						<button
							onclick={() => handleDelete(template.id, template.name)}
							class="flex items-center justify-center px-3 py-1.5 text-sm text-red-600 bg-red-50 rounded-md hover:bg-red-100"
							title="Delete"
						>
							<Trash2 size={14} />
						</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
