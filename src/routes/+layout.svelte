<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { clipboardStore } from '$lib/stores/clipboardStore';
	import { uiStore } from '$lib/stores/uiStore';
	import { themeStore } from '$lib/stores/themeStore';
	import { detectClipboardCapabilities } from '$lib/services/clipboardService';
	import { Home, Settings } from 'lucide-svelte';
	import ThemeToggle from '$lib/components/ui/ThemeToggle.svelte';

	let { children } = $props();

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

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
	<!-- Header -->
	<header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center h-16">
				<div class="flex items-center">
					<a href="/" class="text-xl font-bold text-gray-900 dark:text-gray-100">📋✨</a>
				</div>

				<nav class="flex items-center gap-4">
					<a
						href="/"
						class="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium {$page.url
							.pathname === '/'
							? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
							: 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}"
					>
						<Home size={18} />
						Converter
					</a>
					<a
						href="/templates"
						class="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium {$page.url
							.pathname.startsWith('/templates')
							? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
							: 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'}"
					>
						<Settings size={18} />
						Templates
					</a>
					<ThemeToggle />
				</nav>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
		{@render children()}
	</main>

	<!-- Toast Container -->
	{#if $uiStore.toasts.length > 0}
		<div class="fixed top-4 right-4 z-50 space-y-2">
			{#each $uiStore.toasts as toast (toast.id)}
				<div
					class="px-4 py-3 rounded-lg shadow-lg max-w-sm {toast.type === 'success'
						? 'bg-green-500 text-white'
						: toast.type === 'error'
							? 'bg-red-500 text-white'
							: toast.type === 'warning'
								? 'bg-yellow-500 text-white'
								: 'bg-blue-500 text-white'}"
					role="alert"
				>
					<div class="flex items-center justify-between gap-2">
						<p class="text-sm font-medium">{toast.message}</p>
						<button
							onclick={() => uiStore.removeToast(toast.id)}
							class="text-white hover:text-gray-200"
							aria-label="Close"
						>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}

	<!-- Modal -->
	{#if $uiStore.modal.isOpen}
		<div
			class="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50"
			onclick={uiStore.closeModal}
		>
			<div
				class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6"
				onclick={(e) => e.stopPropagation()}
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
							class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
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
							class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
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
