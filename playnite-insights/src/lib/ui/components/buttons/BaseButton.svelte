<script lang="ts">
	import Spinner from "../Spinner.svelte";
	import type { ComponentSize } from "../types";
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

	const sizeClasses: Record<ComponentSize, string> = {
		sm: "h-8 px-3 text-sm gap-1.5",
		md: "h-10 px-4 text-sm gap-2",
		lg: "h-12 px-5 text-base gap-2.5",
	} as const;

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
		"relative inline-flex select-none items-center whitespace-nowrap",
		"duration-80 transition-colors ease-out",
		"outline-none focus-visible:ring-2 focus-visible:ring-offset-0",
		justify === "center" && "justify-center",
		justify === "between" && "justify-between",
		sizeClasses[size],
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
