<script lang="ts">
	import { cubicInOut } from "svelte/easing";
	import { fade } from "svelte/transition";
</script>

<li
	class={[
		"list-none w-full aspect-[1/1.6]",
		"bg-background-1 shadow-default",
		"border-3 border-black/10",
		"animate-pulse",
	]}
	transition:fade={{ duration: 120, easing: cubicInOut }}
>
	<div class="h-7/8 w-full bg-black/10"></div>
	<div class="h-1/8 flex items-center justify-center p-2"></div>
</li>
