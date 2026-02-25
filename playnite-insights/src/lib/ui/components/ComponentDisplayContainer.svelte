<script lang="ts">
	import type { Snippet } from "svelte";

	let {
		children,
	}: {
		children?: Snippet;
	} = $props();
</script>

<div class="bg-background-2 flex flex-wrap gap-2 p-4">
	{@render children?.()}
</div>
