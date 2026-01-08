<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { clipboardStore } from '$lib/stores/clipboardStore';
	import { uiStore } from '$lib/stores/uiStore';
	import { themeStore, type ThemeMode } from '$lib/stores/themeStore';
	import { detectClipboardCapabilities } from '$lib/services/clipboardService';
	import { ClipboardList, Home, Settings, Sparkle, Sparkles, Github, Linkedin, Menu, X, Sun, Moon, Monitor, Check } from 'lucide-svelte';
	import ThemeToggle from '$lib/components/ui/ThemeToggle.svelte';
	import Toast from '$lib/components/ui/Toast.svelte';

	let { children } = $props();

	// Mobile menu state
	let mobileMenuOpen = $state(false);

	// Theme modes for mobile menu
	const themeModes: { value: ThemeMode; label: string; icon: typeof Sun }[] = [
		{ value: 'light', label: 'Light', icon: Sun },
		{ value: 'dark', label: 'Dark', icon: Moon },
		{ value: 'system', label: 'System', icon: Monitor }
	];

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}

	function handleThemeSelect(mode: ThemeMode) {
		themeStore.setTheme(mode);
	}

	// Get the current theme reactively
	let currentTheme = $derived($themeStore.resolvedTheme);

	// Reactively apply dark class to document
	$effect(() => {
		if (typeof document !== 'undefined') {
			console.log('Theme effect triggered. Current theme:', currentTheme);
			if (currentTheme === 'dark') {
				console.log('Adding dark class to html');
				document.documentElement.classList.add('dark');
			} else {
				console.log('Removing dark class from html');
				document.documentElement.classList.remove('dark');
			}
			console.log('HTML classes:', document.documentElement.className);
		}
	});

	onMount(async () => {
		// Initialize theme system
		themeStore.syncSystemPreference();

		// Detect clipboard capabilities on app load
		try {
			const capabilities = await detectClipboardCapabilities();
			clipboardStore.setCapabilities(capabilities);
		} catch (error) {
			console.error('Error detecting clipboard capabilities:', error);
		}
	});
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 bg-ambient bg-grain flex flex-col overflow-x-hidden">
	<!-- Header -->
	<header class="sticky top-0 z-40 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
			<div class="flex justify-between items-center">
				<div class="flex items-center">
					<a href="/" class="flex items-center hover:scale-[1.02] transition-transform" onclick={closeMobileMenu}>
						<span class="text-2xl font-semibold text-gray-900 dark:text-gray-100">
							Clip<span class="text-blue-600 dark:text-blue-400">Form</span>
						</span>
					</a>
				</div>

				<!-- Desktop Navigation -->
				<nav class="hidden sm:flex items-center gap-1">
					<a
						href="/"
						class="nav-tab {$page.url.pathname === '/' ? 'nav-tab-active' : ''}"
					>
						<ClipboardList size={18} />
						Converter
					</a>
					<a
						href="/templates"
						class="nav-tab {$page.url.pathname.startsWith('/templates') ? 'nav-tab-active' : ''}"
					>
						<Sparkles size={18} />
						Templates
					</a>
					<div class="ml-2 pl-2 border-l border-gray-200 dark:border-gray-700">
						<ThemeToggle />
					</div>
				</nav>

				<!-- Mobile Menu Button -->
				<button
					onclick={toggleMobileMenu}
					class="hidden-on-desktop p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-black/5 dark:text-gray-500 dark:hover:text-gray-200 dark:hover:bg-white/5 transition-all"
					aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
					aria-expanded={mobileMenuOpen}
				>
					{#if mobileMenuOpen}
						<X size={24} />
					{:else}
						<Menu size={24} />
					{/if}
				</button>
			</div>

			<!-- Mobile Navigation Menu -->
			{#if mobileMenuOpen}
				<nav class="sm:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
					<div class="flex flex-col gap-2">
						<a
							href="/"
							onclick={closeMobileMenu}
							class="mobile-nav-item {$page.url.pathname === '/' ? 'mobile-nav-item-active' : ''}"
						>
							<ClipboardList size={20} />
							Converter
						</a>
						<a
							href="/templates"
							onclick={closeMobileMenu}
							class="mobile-nav-item {$page.url.pathname.startsWith('/templates') ? 'mobile-nav-item-active' : ''}"
						>
							<Sparkles size={20} />
							Templates
						</a>
						
						<!-- Theme Selection -->
						<div class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
							<span class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 mb-2 block">
								Theme
							</span>
							<div class="flex flex-col gap-1">
								{#each themeModes as mode}
									{@const IconComponent = mode.icon}
									<button
										onclick={() => handleThemeSelect(mode.value)}
										class="mobile-nav-item justify-between {$themeStore.mode === mode.value ? 'mobile-nav-item-active' : ''}"
									>
										<div class="flex items-center gap-3">
											<IconComponent size={20} />
											<span>{mode.label}</span>
										</div>
										{#if $themeStore.mode === mode.value}
											<Check size={18} class="text-blue-600 dark:text-blue-400" />
										{/if}
									</button>
								{/each}
							</div>
						</div>
					</div>
				</nav>
			{/if}
		</div>
	</header>

	<!-- Main Content -->
	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
		{@render children()}
	</main>

	<!-- Footer -->
	<footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
			<div class="flex items-center justify-between">
				<div class="w-20"></div>
				<p class="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1.5">
					Built with
					<a
						href="https://code.claude.com/docs"
						target="_blank"
						rel="noopener noreferrer"
						class="hover:opacity-80 transition-opacity hover:scale-110 inline-block"
						aria-label="Claude Code"
					>
						<svg
							class="w-4 h-4"
							viewBox="-5 -10 145 160"
							fill="#D97757"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path d="m 29.05,98.54 29.14,-16.35 0.49,-1.42 -0.49,-0.79 h -1.42 l -4.87,-0.3 -16.65,-0.45 -14.44,-0.6 -13.99,-0.75 -3.52,-0.75 -3.3,-4.35 0.34,-2.17 2.96,-1.99 4.24,0.37 9.37,0.64 14.06,0.97 10.2,0.6 15.11,1.57 h 2.4 l 0.34,-0.97 -0.82,-0.6 -0.64,-0.6 -14.55,-9.86 -15.75,-10.42 -8.25,-6 -4.46,-3.04 -2.25,-2.85 -0.97,-6.22 4.05,-4.46 5.44,0.37 1.39,0.37 5.51,4.24 11.77,9.11 15.37,11.32 2.25,1.87 0.9,-0.64 0.11,-0.45 -1.01,-1.69 -8.36,-15.11 -8.92,-15.37 -3.97,-6.37 -1.05,-3.82 c -0.37,-1.57 -0.64,-2.89 -0.64,-4.5 l 4.61,-6.26 2.55,-0.82 6.15,0.82 2.59,2.25 3.82,8.74 6.19,13.76 9.6,18.71 2.81,5.55 1.5,5.14 0.56,1.57 h 0.97 v -0.9 l 0.79,-10.54 1.46,-12.94 1.42,-16.65 0.49,-4.69 2.32,-5.62 4.61,-3.04 3.6,1.72 2.96,4.24 -0.41,2.74 -1.76,11.44 -3.45,17.92 -2.25,12 h 1.31 l 1.5,-1.5 6.07,-8.06 10.2,-12.75 4.5,-5.06 5.25,-5.59 3.37,-2.66 h 6.37 l 4.69,6.97 -2.1,7.2 -6.56,8.32 -5.44,7.05 -7.8,10.5 -4.87,8.4 0.45,0.67 1.16,-0.11 17.62,-3.75 9.52,-1.72 11.36,-1.95 5.14,2.4 0.56,2.44 -2.02,4.99 -12.15,3 -14.25,2.85 -21.22,5.02 -0.26,0.19 0.3,0.37 9.56,0.9 4.09,0.22 h 10.01 l 18.64,1.39 4.87,3.22 2.92,3.94 -0.49,3 -7.5,3.82 -10.12,-2.4 -23.62,-5.62 -8.1,-2.02 h -1.12 v 0.67 l 6.75,6.6 12.37,11.17 15.49,14.4 0.79,3.56 -1.99,2.81 -2.1,-0.3 -13.61,-10.24 -5.25,-4.61 -11.89,-10.01 h -0.79 v 1.05 l 2.74,4.01 14.47,21.75 0.75,6.67 -1.05,2.17 -3.75,1.31 -4.12,-0.75 -8.47,-11.89 -8.74,-13.39 -7.05,-12 -0.86,0.49 -4.16,44.81 -1.95,2.29 -4.5,1.72 -3.75,-2.85 -1.99,-4.61 1.99,-9.11 2.4,-11.89 1.95,-9.45 1.76,-11.74 1.05,-3.9 -0.07,-0.26 -0.86,0.11 -8.85,12.15 -13.46,18.19 -10.65,11.4 -2.55,1.01 -4.42,-2.29 0.41,-4.09 2.47,-3.64 14.74,-18.75 8.89,-11.62 5.74,-6.71 -0.04,-0.97 h -0.34 l -39.15,25.42 -6.97,0.9 -3,-2.81 0.37,-4.61 1.42,-1.5 11.77,-8.1 z"/>
						</svg>
					</a>
					in <a href="https://www.openstreetmap.org/relation/62578" target="_blank" class="hover:opacity-80 transition-opacity hover:scale-110 inline-block" aria-label="Cologne, Germany" rel="noopener noreferrer">CGN</a>
				</p>
				<div class="flex items-center gap-2 w-20 justify-end">
					<a
						href="https://github.com/crlhrtmnn/ClipForm"
						target="_blank"
						rel="noopener noreferrer"
						class="icon-link"
						aria-label="GitHub"
					>
						<Github size={18} />
					</a>
					<a
						href="https://www.linkedin.com/in/carl-hartmann-82b245277/"
						target="_blank"
						rel="noopener noreferrer"
						class="icon-link"
						aria-label="LinkedIn"
					>
						<Linkedin size={18} />
					</a>
				</div>
			</div>
		</div>
	</footer>

	<!-- Toast Container -->
	{#if $uiStore.toasts.length > 0}
		<div class="fixed top-4 right-4 z-50 space-y-2 overflow-hidden">
			{#each $uiStore.toasts as toast (toast.id)}
				<Toast {toast} />
			{/each}
		</div>
	{/if}

	<!-- Modal -->
	{#if $uiStore.modal.isOpen}
		<div
			class="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50"
			onclick={() => uiStore.closeModal()}
			onkeydown={(e) => {
				if (e.key === 'Escape') {
					uiStore.closeModal();
				}
			}}
			role="button"
			tabindex="0"
		>
			<div
				class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6"
				onclick={(e) => e.stopPropagation()}
				onkeydown={(e) => e.stopPropagation()}
				role="dialog"
				tabindex="-1"
			>
				<h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">{$uiStore.modal.title}</h3>
				<p class="text-gray-600 dark:text-gray-400 mb-6">{$uiStore.modal.content}</p>
				<div class="flex justify-end gap-2">
					{#if $uiStore.modal.onCancel}
						<button
							onclick={() => {
								$uiStore.modal.onCancel?.();
								uiStore.closeModal();
							}}
							class="btn btn-secondary btn-md"
						>
							Cancel
						</button>
					{/if}
					{#if $uiStore.modal.onConfirm}
						<button
							onclick={() => {
								$uiStore.modal.onConfirm?.();
								uiStore.closeModal();
							}}
							class="btn btn-primary btn-md"
						>
							Confirm
						</button>
					{/if}
				</div>
			</div>
		</div>
	{/if}

	<!-- Loading Overlay -->
	{#if $uiStore.isLoading}
		<div class="fixed inset-0 bg-black bg-opacity-30 dark:bg-opacity-50 flex items-center justify-center z-50">
			<div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 flex items-center gap-4">
				<div
					class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
					aria-label="Loading"
				></div>
				<p class="text-gray-700 dark:text-gray-300">{$uiStore.loadingMessage}</p>
			</div>
		</div>
	{/if}
</div>
