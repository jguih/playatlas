<script lang="ts">
	import type { ChipProps } from "./chip.types";

	const { variant = "primary", children, ...props }: ChipProps = $props();
</script>

<span
	{...props}
	class={[
		"inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium",
		variant === "success" && ["bg-success-bg/20 text-success-fg"],
		variant === "neutral" && ["bg-neutral-bg/20 text-neutral-fg"],
		variant === "primary" && ["bg-primary-bg/20 text-primary-fg"],
		variant === "warning" && ["bg-warning-bg/20 text-warning-fg"],
		variant === "error" && ["bg-error-bg/20 text-error-fg"],
		props.class,
	]}
>
	{@render children?.()}
</span>
