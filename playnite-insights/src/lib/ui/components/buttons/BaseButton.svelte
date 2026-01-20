<script lang="ts">
	import Spinner from "../Spinner.svelte";
	import type { BaseButtonProps } from "./types";

	let {
		button = $bindable<HTMLButtonElement>(),
		justify = "center",
		rounded = false,
		size = "sm",
		isLoading = false,
		disabled,
		selected,
		...props
	}: BaseButtonProps = $props();

	const dataState = $derived(
		isLoading ? "loading" : disabled ? "disabled" : selected ? "selected" : "default",
	);
</script>

<button
	type="button"
	data-state={dataState}
	aria-busy={isLoading}
	disabled={disabled || isLoading}
	{...props}
	class={[
		[
			size === "sm" && "h-9 gap-1.5 px-3 text-sm",
			size === "md" && "h-11 gap-2 px-4 text-base",
			size === "lg" && "h-13 gap-2.5 px-5 text-base",
		],
		"relative inline-flex select-none items-center whitespace-nowrap",
		"duration-80 transition-colors ease-out",
		"outline-none focus-visible:ring-2 focus-visible:ring-offset-0",
		justify === "center" && "justify-center",
		justify === "between" && "justify-between",
		rounded && "rounded-full",
		"hover:shadow-sm active:shadow-none",
		"data-[state=disabled]:cursor-not-allowed",
		"data-[state=loading]:cursor-wait",
		props.class,
	]}
	bind:this={button}
>
	{#if isLoading}
		<span class="absolute inset-0 flex items-center justify-center">
			<Spinner {size} />
		</span>
	{/if}

	<span class={["inline-flex items-center gap-2", isLoading && "invisible"]}>
		{#if props.children}
			{@render props.children()}
		{/if}
	</span>
</button>
