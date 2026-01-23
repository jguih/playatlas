<script lang="ts">
	import BaseInput from "./BaseInput.svelte";
	import type { BaseInputProps } from "./types";

	let { variant = "primary", ...props }: BaseInputProps = $props();
</script>

<BaseInput
	{variant}
	{...props}
	class={[
		"border",
		["focus-visible:ring-2", "focus-visible:ring-opacity-50"],
		variant === "neutral" && [
			"text-neutral-light-fg",
			"border-neutral-bg",
			"placeholder:text-neutral-light-fg/80",
			["focus-visible:border-neutral-hover-bg", "focus-visible:ring-neutral-hover-bg"],
			"hover:border-neutral-hover-bg",
			[
				"disabled:text-neutral-disabled-fg",
				"disabled:placeholder:text-neutral-disabled-fg/60",
				"disabled:border-neutral-bg/60",
			],
		],
		variant === "primary" && [
			"text-primary-light-fg",
			"border-primary-bg",
			"placeholder:text-primary-light-fg/80",
			["focus-visible:border-primary-hover-bg", "focus-visible:ring-primary-hover-bg"],
			"hover:border-primary-hover-bg",
			[
				"disabled:text-primary-disabled-fg",
				"disabled:placeholder:text-primary-disabled-fg/60",
				"disabled:border-primary-bg/60",
			],
		],
		variant === "error" && [
			"text-error-light-fg",
			"border-error-bg",
			"placeholder:text-error-light-fg/80",
			["focus-visible:border-error-hover-bg", "focus-visible:ring-error-hover-bg"],
			"hover:border-error-hover-bg",
			[
				"disabled:text-error-disabled-fg",
				"disabled:placeholder:text-error-disabled-fg/60",
				"disabled:border-error-bg/60",
			],
		],
		variant === "success" && [
			"text-success-light-fg",
			"border-success-bg",
			"placeholder:text-success-light-fg/80",
			["focus-visible:border-success-hover-bg", "focus-visible:ring-success-hover-bg"],
			"hover:border-success-hover-bg",
			[
				"disabled:text-success-disabled-fg",
				"disabled:placeholder:text-success-disabled-fg/60",
				"disabled:border-success-bg/60",
			],
		],
		variant === "warning" && [
			"text-warning-light-fg",
			"border-warning-bg",
			"placeholder:text-warning-light-fg/80",
			["focus-visible:border-warning-hover-bg", "focus-visible:ring-warning-hover-bg"],
			"hover:border-warning-hover-bg",
			[
				"disabled:text-warning-disabled-fg",
				"disabled:placeholder:text-warning-disabled-fg/60",
				"disabled:border-warning-bg/60",
			],
		],
		props.class,
	]}
/>
