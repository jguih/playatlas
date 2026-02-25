<script lang="ts">
	import { onMount, tick } from "svelte";
	import { cubicInOut } from "svelte/easing";
	import { fly } from "svelte/transition";
	import Backdrop from "./Backdrop.svelte";
	import type { SidebarProps } from "./types";

	let { width = 80, onClose, ...props }: SidebarProps = $props();
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
		"bg-background-1 fixed left-0 right-0 top-0 z-50 h-full max-w-full overflow-y-hidden shadow-xl",
		props.class,
	]}
	style:width={`min(${width}dvw, 28rem)`}
	transition:fly={{ x: `-${width}dvw`, duration: 200, easing: cubicInOut }}
>
	{#if props.children && showChildren}
		{@render props.children()}
	{/if}
</aside>
