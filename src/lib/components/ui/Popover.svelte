<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		trigger: HTMLElement | null;
		show: boolean;
		children?: Snippet;
	}

	let { trigger, show, children }: Props = $props();

	let position = $state({ x: 0, y: 0, placement: 'right' as 'right' | 'left' | 'below' });
	let isVisible = $state(false);

	const POPOVER_WIDTH = 320; // w-80 = 20rem = 320px
	const GAP = 14; // ml-2 = 0.5rem = 8px

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
		let placement: 'right' | 'left' | 'below' = 'right';

		// Try positioning to the right first
		if (rect.right + GAP + POPOVER_WIDTH <= viewportWidth) {
			x = rect.right + GAP;
			placement = 'right';
		}
		// Try positioning to the left
		else if (rect.left - GAP - POPOVER_WIDTH >= 0) {
			x = rect.left - GAP - POPOVER_WIDTH;
			placement = 'left';
		}
		// Fallback: center below the element
		else {
			x = Math.max(GAP, Math.min(viewportWidth - POPOVER_WIDTH - GAP, rect.left));
			y = rect.bottom + GAP;
			placement = 'below';
		}

		// Ensure popover doesn't go off bottom of screen
		if (y + 200 > viewportHeight && placement !== 'below') {
			y = Math.max(GAP, viewportHeight - 200 - GAP);
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
		class="fixed z-999 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-2xl p-3 w-80 pointer-events-none"
		style="left: {position.x}px; top: {position.y}px;"
	>
		{@render children()}
	</div>
{/if}
