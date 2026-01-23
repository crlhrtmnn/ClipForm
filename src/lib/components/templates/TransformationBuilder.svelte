<script lang="ts">
	import type { Transformation, TransformationType, CaptureTransformation, CaptureReplaceTransformation, InsertCapturedTransformation, JsonTransformation } from '$lib/types/template';
	import { getTransformationName, validateRegex } from '$lib/services/transformEngine';
	import { detectPattern } from '$lib/services/patternDetector';
	import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-svelte';

	interface Props {
		transformations: Transformation[];
		ontransformationschange: (transformations: Transformation[]) => void;
	}

	let { transformations = $bindable(), ontransformationschange }: Props = $props();

	// Categorized transformation types
	const transformationCategories: Record<
		string,
		{ value: TransformationType; label: string }[]
	> = {
		Capture: [
			{ value: 'capture_first_match', label: 'Capture First Match' },
			{ value: 'capture_last_match', label: 'Capture Last Match' },
			{ value: 'capture_replace', label: 'Capture Replace' },
			{ value: 'insert_captured', label: 'Insert Captured' }
		],
		Add: [
			{ value: 'add_prefix', label: 'Add Prefix' },
			{ value: 'add_suffix', label: 'Add Suffix' },
			{ value: 'wrap_code_block', label: 'Wrap in Code Block' },
			{ value: 'number_lines', label: 'Number Lines' },
			{ value: 'indent', label: 'Indent' }
		],
		Remove: [
			{ value: 'remove_blank_lines', label: 'Remove Blank Lines' },
			{ value: 'trim_lines', label: 'Trim Lines' },
			{ value: 'dedent', label: 'Dedent' },
			{ value: 'remove_duplicates', label: 'Remove Duplicates' }
		],
		Replace: [{ value: 'regex_replace', label: 'Regex Replace' }],
		Transform: [
			{ value: 'to_uppercase', label: 'To Uppercase' },
			{ value: 'to_lowercase', label: 'To Lowercase' },
			{ value: 'json_beautify', label: 'JSON Beautify' }
		],
		Reorder: [
			{ value: 'sort_lines', label: 'Sort Lines' },
			{ value: 'reverse_lines', label: 'Reverse Lines' }
		]
	};

	// Flatten for easy lookup
	const allTransformationTypes = Object.values(transformationCategories).flat();

	let selectedTypeToAdd = $state('');

	function addTransformation(type: TransformationType) {
		let newTransformation: Transformation;
		const base = {
			id: `trans-${Date.now()}`,
			type: type,
			enabled: true,
			order: transformations.length + 1
		};

		// Initialize with type-specific defaults
		switch (type) {
			case 'capture_first_match':
			case 'capture_last_match':
				newTransformation = { ...base, type, example: '', slotName: 'captured' } as CaptureTransformation;
				break;
			case 'capture_replace':
				newTransformation = { ...base, type, slotName: 'captured', replacement: '' } as CaptureReplaceTransformation;
				break;
			case 'insert_captured':
				newTransformation = { ...base, type, slotName: 'captured', position: 'end', format: '\n\n{value}' } as InsertCapturedTransformation;
				break;
			case 'json_beautify':
				newTransformation = { ...base, type, indent: 2 } as JsonTransformation;
				break;
			default:
				newTransformation = base as Transformation;
		}

		transformations = [...transformations, newTransformation];
		ontransformationschange(transformations);

		// Reset dropdown
		selectedTypeToAdd = '';
	}

	function handleAddTransformationChange(e: Event) {
		const select = e.target as HTMLSelectElement;
		const type = select.value as TransformationType;
		if (type) {
			addTransformation(type);
		}
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

	// Get available capture slot names from transformations defined before the current one
	function getAvailableCaptureSlots(beforeIndex: number): string[] {
		const slots = new Set<string>();
		for (let i = 0; i < beforeIndex; i++) {
			const t = transformations[i];
			if ((t.type === 'capture_first_match' || t.type === 'capture_last_match') && 'slotName' in t) {
				slots.add(t.slotName);
			}
		}
		return Array.from(slots);
	}

	// Get detected pattern description for an example
	function getDetectedPatternType(example: string): string {
		if (!example || !example.trim()) return '';
		const detected = detectPattern(example);
		return detected.description;
	}

</script>

<div class="space-y-4">
	<!-- Add Transformation Dropdown -->
	<div>
		<label for="add-transformation" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
			Add Transformation
		</label>
		<select
			id="add-transformation"
			bind:value={selectedTypeToAdd}
			onchange={handleAddTransformationChange}
			class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
		>
			<option value="">Select transformation type...</option>
			{#each Object.entries(transformationCategories) as [category, types]}
				<optgroup label={category}>
					{#each types as type}
						<option value={type.value}>{type.label}</option>
					{/each}
				</optgroup>
			{/each}
		</select>
	</div>

	<!-- Transformations List -->
	{#if transformations.length === 0}
		<div class="text-center py-8 text-gray-500 dark:text-gray-400">
			No transformations yet. Click "Add Transformation" to get started.
		</div>
	{:else}
		<div class="space-y-3">
			{#each transformations as transformation, index (transformation.id)}
				<div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
					<!-- Header with Type Selector -->
					<div class="flex items-center gap-2 mb-3">
						<span class="text-sm font-medium text-gray-500 dark:text-gray-400 shrink-0">#{index + 1}</span>
						<input
							type="checkbox"
							checked={transformation.enabled}
							onchange={(e) =>
								updateTransformation(transformation.id, {
									enabled: (e.target as HTMLInputElement).checked
								})}
							class="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 shrink-0"
						/>

						<!-- Type Selector Dropdown -->
						<select
							value={transformation.type}
							onchange={(e) =>
								updateTransformation(transformation.id, {
									type: (e.target as HTMLSelectElement).value as TransformationType
								})}
							class="flex-1 px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
						>
							{#each Object.entries(transformationCategories) as [category, types]}
								<optgroup label={category}>
									{#each types as type}
										<option value={type.value}>{type.label}</option>
									{/each}
								</optgroup>
							{/each}
						</select>

						<div class="flex items-center gap-1 shrink-0">
							<!-- Move Up -->
							<button
								onclick={() => moveUp(index)}
								disabled={index === 0}
								class="btn btn-ghost btn-icon btn-sm"
								title="Move up"
							>
								<ChevronUp size={18} />
							</button>

							<!-- Move Down -->
							<button
								onclick={() => moveDown(index)}
								disabled={index === transformations.length - 1}
								class="btn btn-ghost btn-icon btn-sm"
								title="Move down"
							>
								<ChevronDown size={18} />
							</button>

							<!-- Delete -->
							<button
								onclick={() => removeTransformation(transformation.id)}
								class="btn btn-ghost btn-icon btn-sm text-red-400 dark:text-red-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
								title="Delete"
							>
								<Trash2 size={18} />
							</button>
						</div>
					</div>

					<!-- Configuration based on type -->
					{#if transformation.type === 'wrap_code_block' || transformation.type === 'add_prefix' || transformation.type === 'add_suffix'}
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
								class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
							/>
						</div>
					{:else if transformation.type === 'regex_replace'}
						<div class="space-y-2">
							<div>
								<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pattern</label>
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
									class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 font-mono text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
								/>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Replacement</label>
								<input
									type="text"
									value={('replacement' in transformation && transformation.replacement) || ''}
									oninput={(e) =>
										updateTransformation(transformation.id, {
											replacement: (e.target as HTMLInputElement).value
										})}
									placeholder="e.g., \n"
									class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 font-mono text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
								/>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Flags</label>
								<input
									type="text"
									value={('flags' in transformation && transformation.flags) || 'g'}
									oninput={(e) =>
										updateTransformation(transformation.id, {
											flags: (e.target as HTMLInputElement).value
										})}
									placeholder="g, gi, gm, etc."
									class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
								/>
							</div>
						</div>
					{:else if transformation.type === 'number_lines' || transformation.type === 'indent' || transformation.type === 'dedent'}
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
								class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
							/>
						</div>
					{:else if transformation.type === 'capture_first_match' || transformation.type === 'capture_last_match'}
						<div class="space-y-2">
							<div>
								<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
									Example (paste a sample to auto-detect pattern)
								</label>
								<input
									type="text"
									value={('example' in transformation && transformation.example) || ''}
									oninput={(e) =>
										updateTransformation(transformation.id, {
											example: (e.target as HTMLInputElement).value
										})}
									placeholder="e.g., 2026-01-23 01:00:00.073"
									class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 font-mono text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
								/>
								{#if 'example' in transformation && transformation.example}
									{@const detectedType = getDetectedPatternType(transformation.example)}
									{#if detectedType}
										<p class="mt-1 text-sm text-green-600 dark:text-green-400">
											Detected: {detectedType}
										</p>
									{/if}
								{/if}
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
									Slot Name
								</label>
								<input
									type="text"
									value={('slotName' in transformation && transformation.slotName) || 'captured'}
									oninput={(e) =>
										updateTransformation(transformation.id, {
											slotName: (e.target as HTMLInputElement).value
										})}
									placeholder="e.g., timestamp"
									class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
								/>
							</div>
						</div>
					{:else if transformation.type === 'capture_replace'}
						{@const availableSlots = getAvailableCaptureSlots(index)}
						<div class="space-y-2">
							<div>
								<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
									Capture Slot
								</label>
								{#if availableSlots.length > 0}
									<select
										value={('slotName' in transformation && transformation.slotName) || ''}
										onchange={(e) =>
											updateTransformation(transformation.id, {
												slotName: (e.target as HTMLSelectElement).value
											})}
										class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
									>
										{#each availableSlots as slot}
											<option value={slot}>{slot}</option>
										{/each}
									</select>
								{:else}
									<input
										type="text"
										value={('slotName' in transformation && transformation.slotName) || 'captured'}
										oninput={(e) =>
											updateTransformation(transformation.id, {
												slotName: (e.target as HTMLInputElement).value
											})}
										placeholder="e.g., timestamp"
										class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
									/>
									<p class="mt-1 text-sm text-amber-600 dark:text-amber-400">
										No capture slots defined yet. Add a Capture First/Last Match transformation first.
									</p>
								{/if}
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
									Replacement (leave empty to delete matches)
								</label>
								<input
									type="text"
									value={('replacement' in transformation && transformation.replacement) || ''}
									oninput={(e) =>
										updateTransformation(transformation.id, {
											replacement: (e.target as HTMLInputElement).value
										})}
									placeholder="Leave empty to delete"
									class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
								/>
							</div>
						</div>
					{:else if transformation.type === 'insert_captured'}
						{@const availableSlots = getAvailableCaptureSlots(index)}
						<div class="space-y-2">
							<div>
								<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
									Capture Slot
								</label>
								{#if availableSlots.length > 0}
									<select
										value={('slotName' in transformation && transformation.slotName) || ''}
										onchange={(e) =>
											updateTransformation(transformation.id, {
												slotName: (e.target as HTMLSelectElement).value
											})}
										class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
									>
										{#each availableSlots as slot}
											<option value={slot}>{slot}</option>
										{/each}
									</select>
								{:else}
									<input
										type="text"
										value={('slotName' in transformation && transformation.slotName) || 'captured'}
										oninput={(e) =>
											updateTransformation(transformation.id, {
												slotName: (e.target as HTMLInputElement).value
											})}
										placeholder="e.g., timestamp"
										class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
									/>
									<p class="mt-1 text-sm text-amber-600 dark:text-amber-400">
										No capture slots defined yet. Add a Capture First/Last Match transformation first.
									</p>
								{/if}
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
									Position
								</label>
								<select
									value={('position' in transformation && transformation.position) || 'end'}
									onchange={(e) =>
										updateTransformation(transformation.id, {
											position: (e.target as HTMLSelectElement).value as 'start' | 'end'
										})}
									class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
								>
									<option value="start">Start</option>
									<option value="end">End</option>
								</select>
							</div>
							<div>
								<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
									Format (use {'{value}'} as placeholder)
								</label>
								<input
									type="text"
									value={('format' in transformation && transformation.format) || '\n\n{value}'}
									oninput={(e) =>
										updateTransformation(transformation.id, {
											format: (e.target as HTMLInputElement).value
										})}
									placeholder="e.g., \n\nTimestamp: {'{value}'}"
									class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 font-mono text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
								/>
							</div>
						</div>
					{:else if transformation.type === 'json_beautify'}
						<div>
							<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
								Indent Spaces
							</label>
							<input
								type="number"
								value={('indent' in transformation && transformation.indent) || 2}
								oninput={(e) =>
									updateTransformation(transformation.id, {
										indent: parseInt((e.target as HTMLInputElement).value) || 2
									})}
								min="1"
								max="8"
								class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
							/>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>
