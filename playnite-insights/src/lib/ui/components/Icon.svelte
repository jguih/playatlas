<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";
	import type { ComponentSize } from "./types";

	let {
		size = "inherit",
		children,
		...props
	}: {
		size?: ComponentSize | "inherit";
		children: Snippet;
	} & HTMLAttributes<HTMLElement> = $props();
</script>

<span
	{...props}
	class={[
		"shrink-0",
		size === "inherit" && "h-[1.25em] w-[1.25em]",
		size === "sm" && "h-[1.125em] w-[1.125em]",
		size === "md" && "h-[1.25em] w-[1.25em]",
		size === "lg" && "h-[1.5em] w-[1.5em]",
		size === "xl" && "h-[2.2em] w-[2.2em]",
		props.class,
	]}
>
	<span class="[&>svg]:block [&>svg]:h-full [&>svg]:w-full">
		{@render children()}
	</span>
</span>
