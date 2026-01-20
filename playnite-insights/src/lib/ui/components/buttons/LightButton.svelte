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
				"focus-visible:ring-primary-light-selected-fg",
				"bg-primary-light-bg",
				"text-primary-light-fg",
				"hover:bg-primary-light-hover-bg hover:text-primary-light-hover-fg",
				"active:bg-primary-light-active-bg active:text-primary-light-active-fg",
			],
			[
				"data-[state=selected]:bg-primary-light-selected-bg",
				"data-[state=selected]:text-primary-light-selected-fg",
			],
			[
				"data-[state=disabled]:bg-primary-light-disabled-bg",
				"data-[state=disabled]:text-primary-light-disabled-fg",
			],
		],
		variant === "neutral" && [
			[
				"focus-visible:ring-neutral-light-selected-fg",
				"bg-neutral-light-bg",
				"text-neutral-light-fg",
				"hover:bg-neutral-light-hover-bg hover:text-neutral-light-hover-fg",
				"active:bg-neutral-light-active-bg active:text-neutral-light-active-fg",
			],
			[
				"data-[state=selected]:bg-neutral-light-selected-bg",
				"data-[state=selected]:text-neutral-light-selected-fg",
			],
			[
				"data-[state=disabled]:bg-neutral-light-disabled-bg",
				"data-[state=disabled]:text-neutral-light-disabled-fg",
			],
		],
		variant === "error" && [
			[
				"focus-visible:ring-error-light-selected-fg",
				"bg-error-light-bg",
				"text-error-light-fg",
				"hover:bg-error-light-hover-bg hover:text-error-light-hover-fg",
				"active:bg-error-light-active-bg active:text-error-light-active-fg",
			],
			[
				"data-[state=selected]:bg-error-light-selected-bg",
				"data-[state=selected]:text-error-light-selected-fg",
			],
			[
				"data-[state=disabled]:bg-error-light-disabled-bg",
				"data-[state=disabled]:text-error-light-disabled-fg",
			],
		],
		variant === "warning" && [
			[
				"focus-visible:ring-warning-light-selected-fg",
				"bg-warning-light-bg",
				"text-warning-light-fg",
				"hover:bg-warning-light-hover-bg hover:text-warning-light-hover-fg",
				"active:bg-warning-light-active-bg active:text-warning-light-active-fg",
			],
			[
				"data-[state=selected]:bg-warning-light-selected-bg",
				"data-[state=selected]:text-warning-light-selected-fg",
			],
			[
				"data-[state=disabled]:bg-warning-light-disabled-bg",
				"data-[state=disabled]:text-warning-light-disabled-fg",
			],
		],
		variant === "success" && [
			[
				"focus-visible:ring-success-light-selected-fg",
				"bg-success-light-bg",
				"text-success-light-fg",
				"hover:bg-success-light-hover-bg hover:text-success-light-hover-fg",
				"active:bg-success-light-active-bg active:text-success-light-active-fg",
			],
			[
				"data-[state=selected]:bg-success-light-selected-bg",
				"data-[state=selected]:text-success-light-selected-fg",
			],
			[
				"data-[state=disabled]:bg-success-light-disabled-bg",
				"data-[state=disabled]:text-success-light-disabled-fg",
			],
		],
		props.class,
	]}
>
	{#if props.children}
		{@render props.children()}
	{/if}
</BaseButton>
