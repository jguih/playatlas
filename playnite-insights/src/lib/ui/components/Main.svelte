<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";

	const props: HTMLAttributes<HTMLElement> = $props();
</script>

<main
	{...props}
	class={["overflow-y-auto overflow-x-hidden p-4", props.class]}
>
	{#if props.children}
		{@render props.children()}
	{/if}
</main>
