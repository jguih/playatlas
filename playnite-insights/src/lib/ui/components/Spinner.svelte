<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import type { ComponentSize, ComponentVariant } from "./types";

	let {
		size = "md",
		variant = "inherit",
		...props
	}: HTMLAttributes<HTMLDivElement> & {
		size?: ComponentSize;
		variant?: ComponentVariant | "inherit";
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
			[
				variant === "primary" && "text-primary-light-active-fg",
				variant === "error" && "text-error-light-active-fg",
				variant === "warning" && "text-warning-light-active-fg",
				variant === "neutral" && "text-neutral-light-active-fg",
				variant === "success" && "text-success-light-active-fg",
				variant === "inherit" && "text-inherit",
			],
			[
				size === "sm" && "border-3 h-4 w-4",
				size === "md" && "border-3 h-5 w-5",
				size === "lg" && "h-6 w-6 border-4",
			],
		]}
	></span>
</div>
