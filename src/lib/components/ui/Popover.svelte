<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		trigger: HTMLElement | null;
		show: boolean;
		children?: Snippet;
		inside?: boolean; // Position inside the trigger element
	}

	let { trigger, show, children, inside = false }: Props = $props();

	let position = $state({ x: 0, y: 0, placement: 'right' as 'right' | 'left' | 'below' | 'inside' | 'above-center' });
	let isVisible = $state(false);
	let popoverWidth = $state(0);
	let popoverHeight = $state(0);

	const POPOVER_WIDTH = 320; // w-80 = 20rem = 320px
	const GAP = 8; // gap between trigger and popover

	function calculatePosition() {
		if (!trigger) {
			isVisible = false;
			return;
		}

		const rect = trigger.getBoundingClientRect();
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;

		let x = 0;
		let y = rect.top;
		let placement: 'right' | 'left' | 'below' | 'inside' | 'above-center' = 'right';

		// If inside mode, center inside the trigger (always)
		if (inside) {
			const estimatedWidth = popoverWidth || 100;
			const estimatedHeight = popoverHeight || 24;

			x = rect.left + (rect.width - estimatedWidth) / 2;
			y = rect.top + (rect.height - estimatedHeight) / 2;

			placement = 'inside';
			position = { x, y, placement };
			isVisible = true;
			return;
		}

		// Default: position centered below the trigger with a gap
		const estimatedWidth = popoverWidth || POPOVER_WIDTH;
		const estimatedHeight = popoverHeight || 200;

		// Center horizontally over the trigger
		x = rect.left + (rect.width / 2) - (estimatedWidth / 2);

		// Position below with gap
		y = rect.bottom + GAP;
		placement = 'below';

		// Ensure popover doesn't go off left edge
		if (x < GAP) {
			x = GAP;
		}

		// Ensure popover doesn't go off right edge
		if (x + estimatedWidth > viewportWidth - GAP) {
			x = viewportWidth - estimatedWidth - GAP;
		}

		// If there's not enough space below, position above instead
		if (y + estimatedHeight > viewportHeight - GAP) {
			y = rect.top - estimatedHeight - GAP;
			placement = 'above-center';
		}

		// Ensure popover doesn't go off top of screen
		if (y < GAP && placement === 'above-center') {
			y = GAP;
		}

		position = { x, y, placement };
		isVisible = true;
	}

	// Calculate position when trigger or show changes
	$effect(() => {
		if (show && trigger) {
			calculatePosition();
		} else {
			isVisible = false;
		}
	});

	// Recalculate when popover dimensions are known (for better centering)
	$effect(() => {
		if (show && trigger && (popoverWidth > 0 || popoverHeight > 0)) {
			calculatePosition();
		}
	});

	// Recalculate on scroll or resize
	$effect(() => {
		if (!show) return;

		let debounceTimeout: NodeJS.Timeout | null = null;

		const handleUpdate = () => {
			if (debounceTimeout) clearTimeout(debounceTimeout);
			debounceTimeout = setTimeout(() => {
				calculatePosition();
			}, 50);
		};

		window.addEventListener('scroll', handleUpdate, true);
		window.addEventListener('resize', handleUpdate);

		return () => {
			if (debounceTimeout) clearTimeout(debounceTimeout);
			window.removeEventListener('scroll', handleUpdate, true);
			window.removeEventListener('resize', handleUpdate);
		};
	});
</script>

{#if isVisible && children}
	<div
		bind:offsetWidth={popoverWidth}
		bind:offsetHeight={popoverHeight}
		class="popover-container fixed z-999 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-300 dark:border-gray-600 rounded-lg shadow-2xl pointer-events-none {position.placement === 'above-center' || position.placement === 'below' ? 'p-3 w-80' : position.placement === 'inside' ? 'p-2 w-auto' : 'p-3 w-80'}"
		style="left: {position.x}px; top: {position.y}px;"
	>
		{@render children()}
	</div>
{/if}

<style>
	/* Popover fades in with subtle scale - fast and unobtrusive */
	.popover-container {
		animation: popover-enter 0.15s cubic-bezier(0.4, 0, 0.2, 1);
		transform-origin: top center;
	}

	@keyframes popover-enter {
		from {
			opacity: 0;
			transform: scale(0.97);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	/* Accessibility: respect reduced motion */
	@media (prefers-reduced-motion: reduce) {
		.popover-container {
			animation: none;
		}
	}
</style>
