<script lang="ts">
	import { onMount, tick } from "svelte";
	import { cubicInOut } from "svelte/easing";
	import { fly } from "svelte/transition";
	import Backdrop from "./Backdrop.svelte";
	import type { BottomSheetProps } from "./types";

	let { height = 100, onClose, ...props }: BottomSheetProps = $props();
	let showChildren = $state(false);
	let asideEl: HTMLElement;
	let previousFocus: HTMLElement | null = null;

	onMount(() => {
		previousFocus = document.activeElement as HTMLElement;

		tick()
			.then(() => {
				showChildren = true;
				asideEl.focus();
			})
			.catch(() => {});

		const handleOnKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") onClose?.();
		};

		window.addEventListener("keydown", handleOnKeyDown);

		return () => {
			window.removeEventListener("keydown", handleOnKeyDown);
			previousFocus?.focus();
		};
	});
</script>

<Backdrop onclick={onClose} />
<aside
	{...props}
	bind:this={asideEl}
	tabindex="-1"
	role="dialog"
	aria-modal="true"
	class={[
		"bg-background-1 fixed bottom-0 right-0 z-50 max-h-full w-full overflow-y-hidden shadow",
		props.class,
	]}
	style:height={`${height}dvh`}
	transition:fly={{ y: `${height}dvh`, duration: 200, easing: cubicInOut }}
>
	{#if props.children && showChildren}
		{@render props.children()}
	{/if}
</aside>
