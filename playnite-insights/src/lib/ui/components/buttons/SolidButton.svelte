<script lang="ts">
	import BaseButton from "./BaseButton.svelte";
	import type { BaseButtonProps } from "./types";

	let props: BaseButtonProps = $props();

	const { variant = "primary" } = $derived(props);
</script>

<BaseButton
	{...props}
	class={[
		variant === "primary" && [
			[
				"focus-visible:ring-primary-selected-bg",
				"bg-primary-bg",
				"text-primary-fg",
				"hover:bg-primary-hover-bg hover:text-primary-hover-fg",
				"active:bg-primary-active-bg active:text-primary-active-fg",
			],
			[
				"data-[state=selected]:bg-primary-selected-bg",
				"data-[state=selected]:text-primary-selected-fg",
			],
			[
				"data-[state=disabled]:bg-primary-disabled-bg",
				"data-[state=disabled]:text-primary-disabled-fg",
			],
		],
		variant === "neutral" && [
			[
				"focus-visible:ring-neutral-selected-bg",
				"bg-neutral-bg",
				"text-neutral-fg",
				"hover:bg-neutral-hover-bg hover:text-neutral-hover-fg",
				"active:bg-neutral-active-bg active:text-neutral-active-fg",
			],
			[
				"data-[state=selected]:bg-neutral-selected-bg",
				"data-[state=selected]:text-neutral-selected-fg",
			],
			[
				"data-[state=disabled]:bg-neutral-disabled-bg",
				"data-[state=disabled]:text-neutral-disabled-fg",
			],
		],
		variant === "error" && [
			[
				"focus-visible:ring-error-selected-bg",
				"bg-error-bg",
				"text-error-fg",
				"hover:bg-error-hover-bg hover:text-error-hover-fg",
				"active:bg-error-active-bg active:text-error-active-fg",
			],
			[
				"data-[state=selected]:bg-error-selected-bg",
				"data-[state=selected]:text-error-selected-fg",
			],
			[
				"data-[state=disabled]:bg-error-disabled-bg",
				"data-[state=disabled]:text-error-disabled-fg",
			],
		],
		variant === "warning" && [
			[
				"focus-visible:ring-warning-selected-bg",
				"bg-warning-bg",
				"text-warning-fg",
				"hover:bg-warning-hover-bg hover:text-warning-hover-fg",
				"active:bg-warning-active-bg active:text-warning-active-fg",
			],
			[
				"data-[state=selected]:bg-warning-selected-bg",
				"data-[state=selected]:text-warning-selected-fg",
			],
			[
				"data-[state=disabled]:bg-warning-disabled-bg",
				"data-[state=disabled]:text-warning-disabled-fg",
			],
		],
		variant === "success" && [
			[
				"focus-visible:ring-success-selected-bg",
				"bg-success-bg",
				"text-success-fg",
				"hover:bg-success-hover-bg hover:text-success-hover-fg",
				"active:bg-success-active-bg active:text-success-active-fg",
			],
			[
				"data-[state=selected]:bg-success-selected-bg",
				"data-[state=selected]:text-success-selected-fg",
			],
			[
				"data-[state=disabled]:bg-success-disabled-bg",
				"data-[state=disabled]:text-success-disabled-fg",
			],
		],
		props.class,
	]}
>
	{#if props.children}
		{@render props.children()}
	{/if}
</BaseButton>
