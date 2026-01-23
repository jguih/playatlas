<script lang="ts">
	import BaseInput from "./BaseInput.svelte";
	import type { BaseInputProps } from "./types";

	let props: BaseInputProps = $props();
</script>

<BaseInput
	{...props}
	class={[
		"bg-black/10",
		"placeholder:text-primary-light-disabled-fg",
		[
			"hover:bg-primary-light-hover-bg",
			"focus-visible:bg-primary-light-bg",
			"focus-visible:ring-2",
			"focus-visible:ring-primary-light-selected-fg",
		],
		"active:bg-primary-light-active-bg",
		"border border-neutral-light-disabled-bg",
		[
			"disabled:bg-primary-light-disabled-bg",
			"disabled:text-primary-light-disabled-fg",
			"disabled:cursor-not-allowed",
		],
		props.class,
	]}
/>
