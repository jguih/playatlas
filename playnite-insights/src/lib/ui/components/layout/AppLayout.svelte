<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";

	let props: HTMLAttributes<HTMLDivElement> & {
		header: Snippet;
		banner: Snippet;
		bottomNav: Snippet;
	} = $props();
</script>

<div
	{...props}
	class={[
		"grid grid-rows-[var(--header-height)_auto_1fr_var(--bottom-nav-height)]",
		" h-dvh w-full overflow-hidden",
		props.class,
	]}
>
	{@render props.header()}
	{@render props.banner()}
	{#if props.children}
		{@render props.children()}
	{/if}
	{@render props.bottomNav()}
</div>
