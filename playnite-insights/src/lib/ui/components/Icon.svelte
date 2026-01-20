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
		"inline-flex shrink-0 items-center justify-center align-middle leading-none",
		size === "inherit" && "h-[1.25em] w-[1.25em]",
		size === "sm" && "h-[1.125em] w-[1.125em]",
		size === "md" && "h-[1.25em] w-[1.25em]",
		size === "lg" && "h-[1.5em] w-[1.5em]",
		props.class,
	]}
>
	<span class="[&>svg]:block [&>svg]:h-full [&>svg]:w-full">
		{@render children()}
	</span>
</span>
