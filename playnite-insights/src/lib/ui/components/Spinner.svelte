<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import type { ComponentSize } from "./types";

	let {
		size = "md",
		...props
	}: HTMLAttributes<HTMLDivElement> & {
		size?: ComponentSize;
	} = $props();

	const sizeClasses = {
		sm: "h-4 w-4 border-2",
		md: "h-5 w-5 border-2",
		lg: "h-6 w-6 border-[3px]",
	} as const;
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
			sizeClasses[size],
		]}
	></span>
</div>
