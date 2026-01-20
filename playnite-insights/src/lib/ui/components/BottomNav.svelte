<script lang="ts">
	import type { Snippet } from "svelte";

	let { children }: { children?: Snippet } = $props();
</script>

<div
	class={[
		"border-t-1 border-solid border-neutral-800/80",
		"flex flex-row items-center justify-between gap-4",
		"bg-background-1 h-[var(--bottom-nav-height)] p-4 shadow",
	]}
>
	{#if children}
		{@render children()}
	{/if}
</div>
