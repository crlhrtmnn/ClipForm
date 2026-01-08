<script lang="ts">
	import type { Toast } from '$lib/stores/uiStore';
	import { uiStore } from '$lib/stores/uiStore';
	import { X, Check, AlertCircle, AlertTriangle, Info } from 'lucide-svelte';

	interface Props {
		toast: Toast;
	}

	let { toast }: Props = $props();

	const icons = {
		success: Check,
		error: AlertCircle,
		warning: AlertTriangle,
		info: Info
	};

	const colors = {
		success: 'bg-green-500',
		error: 'bg-red-500',
		warning: 'bg-amber-500',
		info: 'bg-blue-500'
	};

	const Icon = $derived(icons[toast.type]);
</script>

<div
	class="toast-item px-4 py-3 rounded-lg shadow-lg max-w-sm text-white flex items-center gap-3 {colors[
		toast.type
	]}"
	class:toast-entering={toast.state === 'entering'}
	class:toast-visible={toast.state === 'visible'}
	class:toast-exiting={toast.state === 'exiting'}
	role="alert"
>
	<div class="shrink-0">
		<Icon size={18} strokeWidth={2.5} />
	</div>
	<p class="text-sm font-medium flex-1">{toast.message}</p>
	<button
		onclick={() => uiStore.removeToast(toast.id)}
		class="shrink-0 text-white/80 hover:text-white transition-colors"
		aria-label="Close"
	>
		<X size={16} />
	</button>
</div>

<style>
	.toast-item {
		transform: translateX(0);
		opacity: 1;
		transition:
			transform 300ms cubic-bezier(0.4, 0, 0.2, 1),
			opacity 300ms cubic-bezier(0.4, 0, 0.2, 1);
	}

	.toast-entering {
		transform: translateX(100%);
		opacity: 0;
	}

	.toast-visible {
		transform: translateX(0);
		opacity: 1;
	}

	.toast-exiting {
		transform: translateX(100%);
		opacity: 0;
	}
</style>
