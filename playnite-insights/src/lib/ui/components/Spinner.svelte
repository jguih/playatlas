<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import type { ComponentSize } from "./types";

	let {
		size = "md",
		...props
	}: HTMLAttributes<HTMLDivElement> & {
		size?: ComponentSize;
	} = $props();
</script>

<div
	{...props}
	class={["flex items-center justify-center", props.class]}
>
	<span
		aria-hidden="true"
		class={[
			"inline-block rounded-full",
			"animate-spin",
			"border-current border-t-transparent",
			"text-inherit",
			size === "sm" && "border-3 h-4 w-4",
			size === "md" && "border-3 h-5 w-5",
			size === "lg" && "h-6 w-6 border-4",
		]}
	></span>
</div>
