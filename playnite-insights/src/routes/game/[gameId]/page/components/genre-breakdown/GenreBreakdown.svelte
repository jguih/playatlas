<script lang="ts">
	import Dropdown from "$lib/ui/components/dropdown/Dropdown.svelte";
	import type { ClassificationsBreakdownMap } from "../../game-view-model.svelte";

	type GenreBreakdownProps = {
		classificationsBreakdownSignal: ClassificationsBreakdownMap;
	};

	const { classificationsBreakdownSignal }: GenreBreakdownProps = $props();
</script>

{#each classificationsBreakdownSignal as [classificationId, { groupDetails, rawTier, tierLabel, engineLabel, engineDescription }] (classificationId)}
	<Dropdown>
		{#snippet label()}
			<span class="inline-flex w-full gap-2 justify-between">
				<span class="font-semibold">
					{engineLabel()}
				</span>
				<span
					class={[
						"justify-self-end self-end text-sm",
						[rawTier === "core" && "font-bold", rawTier === "strong" && "font-medium"],
						[
							(rawTier === "core" || rawTier === "strong") && "text-success-light-active-fg",
							rawTier === "weak" && "text-warning-light-active-fg",
						],
					]}
				>
					{tierLabel()}
				</span>
			</span>
		{/snippet}
		<div class="px-4 py-3">
			<p class="text-sm mb-4 leading-relaxed">
				{engineDescription()}
			</p>
			<ul class="divide-y divide-black/10">
				{#each groupDetails as groupDetail (groupDetail.label())}
					{#if groupDetail.visible}
						<li class="py-3">
							<p class="text-sm font-medium mb-1">
								{groupDetail.label()}
							</p>
							<p class="text-sm text-muted leading-relaxed">
								{groupDetail.description()}
							</p>
						</li>
					{/if}
				{/each}
			</ul>
		</div>
	</Dropdown>
{/each}
