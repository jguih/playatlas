<script lang="ts">
	import type { Snippet } from "svelte";

	let {
		children,
	}: {
		children?: Snippet;
	} = $props();
</script>

<p class="text-neutral-400">
	{@render children?.()}
</p>
