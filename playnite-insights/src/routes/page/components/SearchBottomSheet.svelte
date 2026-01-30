<script lang="ts">
	import LightButton from "$lib/ui/components/buttons/LightButton.svelte";
	import Input from "$lib/ui/components/forms/Input.svelte";
	import Icon from "$lib/ui/components/Icon.svelte";
	import AsideBody from "$lib/ui/components/sidebar/AsideBody.svelte";
	import BottomSheet from "$lib/ui/components/sidebar/BottomSheet.svelte";
	import { ArrowLeftIcon } from "@lucide/svelte";
	import { onMount } from "svelte";
	import type { EventHandler, FormEventHandler } from "svelte/elements";
	import type { SearchBottomSheetTypes } from "./search-bottom-sheet.types";

	let { onClose, value = $bindable(), onChange }: SearchBottomSheetTypes = $props();

	let input: HTMLInputElement | undefined = $state(undefined);

	const handleSubmit: EventHandler<SubmitEvent> = (event) => {
		event.preventDefault();
		onClose();
	};

	const handleInput: FormEventHandler<HTMLInputElement> = (event) => {
		const value = event.currentTarget.value;
		onChange(value);
	};

	onMount(() => {
		requestAnimationFrame(() => {
			if (input) input.focus();
		});
	});
</script>

<BottomSheet {onClose}>
	<AsideBody>
		<header class="flex gap-2">
			<LightButton
				variant="neutral"
				iconOnly
				onclick={onClose}
			>
				<Icon>
					<ArrowLeftIcon />
				</Icon>
			</LightButton>
			<form
				onsubmit={handleSubmit}
				class="w-full"
			>
				<Input
					variant="neutral"
					enterkeyhint="done"
					class="w-full"
					bind:input
					bind:value
					oninput={handleInput}
				/>
			</form>
		</header>
	</AsideBody>
</BottomSheet>
