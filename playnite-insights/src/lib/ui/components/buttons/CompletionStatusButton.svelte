<script lang="ts">
	import type { CompletionStatus } from "$lib/modules/game-library/domain";
	import { Gamepad2Icon } from "@lucide/svelte";
	import Icon from "../Icon.svelte";
	import type { ComponentVariant } from "../types";
	import SolidButton from "./SolidButton.svelte";
	import type { BaseButtonProps } from "./types";

	let { completionStatus, ...props }: BaseButtonProps & { completionStatus: CompletionStatus } =
		$props();

	const variant: ComponentVariant = $derived(
		completionStatus.Name?.match(/playing/i)
			? "success"
			: completionStatus.Name?.match(/not played/i)
				? "neutral"
				: "primary",
	);
</script>

<div class="flex flex-col items-center justify-center gap-1">
	<SolidButton
		{variant}
		iconOnly
		size="xl"
		{...props}
		class={["text-4xl!", props.class]}
	>
		<Icon>
			<Gamepad2Icon />
		</Icon>
	</SolidButton>
	<p class="text-sm text-center font-medium whitespace-nowrap w-18 grow-0 truncate">
		{completionStatus.Name}
	</p>
</div>
