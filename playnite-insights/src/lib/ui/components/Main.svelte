<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";

	let {
		bottomNav = true,
		...props
	}: HTMLAttributes<HTMLElement> & {
		bottomNav?: boolean;
	} = $props();
</script>

<main
	{...props}
	class={[
		"absolute left-0 right-0 top-[var(--header-height)] overflow-y-auto overflow-x-hidden p-4",
		bottomNav ? "bottom-[var(--bottom-nav-height)]" : "bottom-0",
		props.class,
	]}
>
	{#if props.children}
		{@render props.children()}
	{/if}
</main>
