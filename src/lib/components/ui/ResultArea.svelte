<script lang="ts">
	import { copyWithFallback } from '$lib/services/clipboardService';
	import { toast } from '$lib/stores/uiStore';
	import { Check, Copy, X, ChevronDown, ChevronUp } from 'lucide-svelte';
	import { slide } from 'svelte/transition';

	interface Props {
		visible: boolean;
		templateName: string;
		input: string;
		output: string;
		onHide: () => void;
	}

	let { visible, templateName, input, output, onHide }: Props = $props();

	let copied = $state(false);
	let isCollapsed = $state(false);

	// Count lines
	const inputLineCount = $derived(input.split('\n').length);
	const outputLineCount = $derived(output.split('\n').length);

	async function handleCopy() {
		const success = await copyWithFallback(output);
		if (success) {
			copied = true;
			toast.success('Copied to clipboard!');
			setTimeout(() => {
				copied = false;
			}, 2000);
		} else {
			toast.error('Failed to copy');
		}
	}

	function toggleCollapse() {
		isCollapsed = !isCollapsed;
	}
</script>

{#if visible}
	<div
		class="bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
		transition:slide={{ duration: 300 }}
	>
		<!-- Header -->
		<div class="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
			<div class="flex items-center gap-2">
				<Check size={18} class="text-green-600 dark:text-green-500" />
				<span class="text-sm font-medium text-gray-700 dark:text-gray-300">
					Transformed with <span class="text-blue-600 dark:text-blue-400">{templateName}</span>
				</span>
			</div>

			<div class="flex items-center gap-2">
				<button
					type="button"
					onclick={handleCopy}
					class="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
				>
					{#if copied}
						<Check size={16} class="text-green-600 dark:text-green-500" />
						<span class="text-green-600 dark:text-green-500">Copied</span>
					{:else}
						<Copy size={16} />
						<span>Copy</span>
					{/if}
				</button>

				<button
					type="button"
					onclick={toggleCollapse}
					class="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
					title={isCollapsed ? 'Expand' : 'Collapse'}
				>
					{#if isCollapsed}
						<ChevronDown size={18} />
					{:else}
						<ChevronUp size={18} />
					{/if}
				</button>

				<button
					type="button"
					onclick={onHide}
					class="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
					title="Hide result"
				>
					<X size={18} />
				</button>
			</div>
		</div>

		<!-- Content -->
		{#if !isCollapsed}
			<div class="p-4" transition:slide={{ duration: 200 }}>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<!-- Input -->
					<div>
						<div class="flex items-center justify-between mb-2">
							<span class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Input</span>
							<span class="text-xs text-gray-400 dark:text-gray-500">{inputLineCount} lines</span>
						</div>
						<div class="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-3 font-mono text-sm whitespace-pre-wrap max-h-64 overflow-auto text-gray-700 dark:text-gray-300">
							{input}
						</div>
					</div>

					<!-- Output -->
					<div>
						<div class="flex items-center justify-between mb-2">
							<span class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Output</span>
							<span class="text-xs text-gray-400 dark:text-gray-500">{outputLineCount} lines</span>
						</div>
						<div class="bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 p-3 font-mono text-sm whitespace-pre-wrap max-h-64 overflow-auto text-gray-700 dark:text-gray-300">
							{output}
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
{/if}
