<script lang="ts">
	import { themeStore, type ThemeMode } from '$lib/stores/themeStore';
	import { Sun, Moon, Monitor, Check } from 'lucide-svelte';
	import { onMount } from 'svelte';

	let isOpen = $state(false);
	let dropdownRef: HTMLDivElement | null = $state(null);

	const modes: { value: ThemeMode; label: string; component: any }[] = [
		{ value: 'light', label: 'Light', component: Sun },
		{ value: 'dark', label: 'Dark', component: Moon },
		{ value: 'system', label: 'System', component: Monitor }
	];

	// Get current icon component based on resolved theme
	const CurrentIcon = $derived(
		$themeStore.mode === 'system'
			? Monitor
			: $themeStore.resolvedTheme === 'dark' ? Moon : Sun
	);

	const handleSelect = (mode: ThemeMode) => {
		console.log('Theme selected:', mode);
		themeStore.setTheme(mode);
		console.log('Theme store after setTheme:', $themeStore);
		isOpen = false;
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
			isOpen = false;
		}
	};

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<div class="relative" bind:this={dropdownRef}>
	<button
		onclick={() => (isOpen = !isOpen)}
		class="icon-link"
		aria-label="Toggle theme"
		aria-expanded={isOpen}
	>
		<CurrentIcon size={18} />
	</button>

	{#if isOpen}
		<div
			class="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
		>
			<div class="py-1">
				{#each modes as mode}
					{@const IconComponent = mode.component}
					<button
						onclick={() => handleSelect(mode.value)}
						class="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors {$themeStore.mode === mode.value ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' : ''}"
					>
						<div class="flex items-center gap-2.5">
							<IconComponent size={16} />
							<span>{mode.label}</span>
						</div>
						{#if $themeStore.mode === mode.value}
							<Check size={16} class="text-blue-600 dark:text-blue-400" />
						{/if}
					</button>
				{/each}
			</div>
		</div>
	{/if}
</div>
