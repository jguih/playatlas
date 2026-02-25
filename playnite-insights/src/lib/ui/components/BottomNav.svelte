<script lang="ts">
	import type { Snippet } from "svelte";

	let { children }: { children?: Snippet } = $props();
</script>

<div
	class={[
		"border-t border-neutral-800/80",
		"flex items-center",
		"bg-background-1 h-(--bottom-nav-height) shadow",
	]}
>
	{#if children}
		<div class="flex w-full justify-around">
			{@render children()}
		</div>
	{/if}
</div>
