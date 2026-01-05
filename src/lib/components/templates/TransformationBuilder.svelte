<script lang="ts">
	import type { Transformation, TransformationType } from '$lib/types/template';
	import { getTransformationName, validateRegex } from '$lib/services/transformEngine';
	import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-svelte';

	interface Props {
		transformations: Transformation[];
		ontransformationschange: (transformations: Transformation[]) => void;
	}

	let { transformations = $bindable(), ontransformationschange }: Props = $props();

	const transformationTypes: { value: TransformationType; label: string; needsValue: boolean }[] = [
		{ value: 'remove_blank_lines', label: 'Remove Blank Lines', needsValue: false },
		{ value: 'trim_lines', label: 'Trim Lines', needsValue: false },
		{ value: 'wrap_code_block', label: 'Wrap in Code Block', needsValue: true },
		{ value: 'add_prefix', label: 'Add Prefix', needsValue: true },
		{ value: 'add_suffix', label: 'Add Suffix', needsValue: true },
		{ value: 'regex_replace', label: 'Regex Replace', needsValue: true },
		{ value: 'to_uppercase', label: 'To Uppercase', needsValue: false },
		{ value: 'to_lowercase', label: 'To Lowercase', needsValue: false },
		{ value: 'remove_duplicates', label: 'Remove Duplicates', needsValue: false },
		{ value: 'sort_lines', label: 'Sort Lines', needsValue: false },
		{ value: 'reverse_lines', label: 'Reverse Lines', needsValue: false },
		{ value: 'number_lines', label: 'Number Lines', needsValue: true },
		{ value: 'indent', label: 'Indent', needsValue: true },
		{ value: 'dedent', label: 'Dedent', needsValue: true }
	];

	function addTransformation() {
		const newTransformation: Transformation = {
			id: `trans-${Date.now()}`,
			type: 'remove_blank_lines',
			enabled: true,
			order: transformations.length + 1
		};
		transformations = [...transformations, newTransformation];
		ontransformationschange(transformations);
	}

	function removeTransformation(id: string) {
		transformations = transformations.filter((t) => t.id !== id);
		// Reorder
		transformations = transformations.map((t, i) => ({ ...t, order: i + 1 }));
		ontransformationschange(transformations);
	}

	function moveUp(index: number) {
		if (index === 0) return;
		const newTransformations = [...transformations];
		[newTransformations[index - 1], newTransformations[index]] = [
			newTransformations[index],
			newTransformations[index - 1]
		];
		transformations = newTransformations.map((t, i) => ({ ...t, order: i + 1 }));
		ontransformationschange(transformations);
	}

	function moveDown(index: number) {
		if (index === transformations.length - 1) return;
		const newTransformations = [...transformations];
		[newTransformations[index], newTransformations[index + 1]] = [
			newTransformations[index + 1],
			newTransformations[index]
		];
		transformations = newTransformations.map((t, i) => ({ ...t, order: i + 1 }));
		ontransformationschange(transformations);
	}

	function updateTransformation(id: string, updates: Partial<Transformation>) {
		transformations = transformations.map((t) => (t.id === id ? { ...t, ...updates } : t));
		ontransformationschange(transformations);
	}

	function getTransformationTypeInfo(type: TransformationType) {
		return transformationTypes.find((t) => t.value === type);
	}

</script>

<div class="space-y-4">
	<!-- Add Transformation Button -->
	<button
		onclick={addTransformation}
		class="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
	>
		<Plus size={16} />
		Add Transformation
	</button>

	<!-- Transformations List -->
	{#if transformations.length === 0}
		<div class="text-center py-8 text-gray-500">
			No transformations yet. Click "Add Transformation" to get started.
		</div>
	{:else}
		<div class="space-y-3">
			{#each transformations as transformation, index (transformation.id)}
				<div class="bg-white border border-gray-200 rounded-lg p-4">
					<!-- Header -->
					<div class="flex items-center justify-between mb-3">
						<div class="flex items-center gap-2">
							<span class="text-sm font-medium text-gray-500">#{index + 1}</span>
							<input
								type="checkbox"
								checked={transformation.enabled}
								onchange={(e) =>
									updateTransformation(transformation.id, {
										enabled: (e.target as HTMLInputElement).checked
									})}
								class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
							/>
							<span class="text-sm font-medium">
								{getTransformationName(transformation.type)}
							</span>
						</div>

						<div class="flex items-center gap-1">
							<!-- Move Up -->
							<button
								onclick={() => moveUp(index)}
								disabled={index === 0}
								class="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
								title="Move up"
							>
								<ChevronUp size={18} />
							</button>

							<!-- Move Down -->
							<button
								onclick={() => moveDown(index)}
								disabled={index === transformations.length - 1}
								class="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
								title="Move down"
							>
								<ChevronDown size={18} />
							</button>

							<!-- Delete -->
							<button
								onclick={() => removeTransformation(transformation.id)}
								class="p-1 text-red-400 hover:text-red-600"
								title="Delete"
							>
								<Trash2 size={18} />
							</button>
						</div>
					</div>

					<!-- Type Selector -->
					<div class="mb-3">
						<label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
						<select
							value={transformation.type}
							onchange={(e) =>
								updateTransformation(transformation.id, {
									type: (e.target as HTMLSelectElement).value as TransformationType
								})}
							class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
						>
							{#each transformationTypes as type}
								<option value={type.value}>{type.label}</option>
							{/each}
						</select>
					</div>

					<!-- Configuration based on type -->
					{#if transformation.type === 'wrap_code_block' || transformation.type === 'add_prefix' || transformation.type === 'add_suffix'}
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">
								{transformation.type === 'wrap_code_block'
									? 'Language (optional)'
									: transformation.type === 'add_prefix'
										? 'Prefix Text'
										: 'Suffix Text'}
							</label>
							<input
								type="text"
								value={('value' in transformation && transformation.value) || ''}
								oninput={(e) =>
									updateTransformation(transformation.id, {
										value: (e.target as HTMLInputElement).value
									})}
								placeholder={transformation.type === 'wrap_code_block' ? 'e.g., javascript' : ''}
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
							/>
						</div>
					{:else if transformation.type === 'regex_replace'}
						<div class="space-y-2">
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Pattern</label>
								<input
									type="text"
									value={('pattern' in transformation && transformation.pattern) || ''}
									oninput={(e) => {
										const pattern = (e.target as HTMLInputElement).value;
										const flags = ('flags' in transformation && transformation.flags) || 'g';
										const isValid = validateRegex(pattern, flags);
										updateTransformation(transformation.id, { pattern });
									}}
									placeholder="e.g., \n\n+"
									class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 font-mono text-sm"
								/>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Replacement</label>
								<input
									type="text"
									value={('replacement' in transformation && transformation.replacement) || ''}
									oninput={(e) =>
										updateTransformation(transformation.id, {
											replacement: (e.target as HTMLInputElement).value
										})}
									placeholder="e.g., \n"
									class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 font-mono text-sm"
								/>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 mb-1">Flags</label>
								<input
									type="text"
									value={('flags' in transformation && transformation.flags) || 'g'}
									oninput={(e) =>
										updateTransformation(transformation.id, {
											flags: (e.target as HTMLInputElement).value
										})}
									placeholder="g, gi, gm, etc."
									class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
								/>
							</div>
						</div>
					{:else if transformation.type === 'number_lines' || transformation.type === 'indent' || transformation.type === 'dedent'}
						<div>
							<label class="block text-sm font-medium text-gray-700 mb-1">
								{transformation.type === 'number_lines'
									? 'Start From'
									: transformation.type === 'indent'
										? 'Spaces to Add'
										: 'Spaces to Remove'}
							</label>
							<input
								type="number"
								value={('value' in transformation && transformation.value) || 1}
								oninput={(e) =>
									updateTransformation(transformation.id, {
										value: parseInt((e.target as HTMLInputElement).value) || 1
									})}
								min="1"
								class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
							/>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>
