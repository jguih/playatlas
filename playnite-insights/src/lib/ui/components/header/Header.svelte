<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";

	const props: HTMLAttributes<HTMLElement> = $props();
</script>

<header
	{...props}
	class={[
		"bg-background-1 h-(--header-height) w-full px-4 pb-2 pt-[calc(--spacing(2)+env(safe-area-inset-top))] shadow",
		props.class,
	]}
>
	{#if props.children}
		{@render props.children()}
	{/if}
</header>
