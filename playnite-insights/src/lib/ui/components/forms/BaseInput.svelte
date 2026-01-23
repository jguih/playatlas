<script lang="ts">
	import type { BaseInputProps } from "./types";

	let {
		value = $bindable<BaseInputProps["value"]>(),
		input = $bindable(),
		...props
	}: BaseInputProps = $props();
</script>

<input
	{...props}
	class={["m-0 w-full p-2 outline-0 transition-colors-default", props.class]}
	bind:value
	bind:this={input}
/>
