<script lang="ts">
	import type { Snippet } from "svelte";

	let {
		title,
		children,
	}: {
		title?: string;
		children?: Snippet;
	} = $props();
</script>

<section class={["bg-background-1 grow space-y-4 border border-neutral-800/60 p-4"]}>
	{#if title}
		<h2 class="text-lg">
			{title}
		</h2>
	{/if}

	{@render children?.()}
</section>
