<script lang="ts">
	import { resolve } from "$app/paths";
	import { getClientApiContext } from "$lib/modules/bootstrap/application";
	import CompletionStatusButton from "$lib/ui/components/buttons/CompletionStatusButton.svelte";
	import LightButton from "$lib/ui/components/buttons/LightButton.svelte";
	import SolidButton from "$lib/ui/components/buttons/SolidButton.svelte";
	import Header from "$lib/ui/components/header/Header.svelte";
	import Icon from "$lib/ui/components/Icon.svelte";
	import AppLayout from "$lib/ui/components/layout/AppLayout.svelte";
	import Main from "$lib/ui/components/Main.svelte";
	import Spinner from "$lib/ui/components/Spinner.svelte";
	import { GameAssets } from "$lib/ui/state";
	import { ArrowLeftIcon } from "@lucide/svelte";
	import { GameAggregateStore } from "./page/game-aggregate-store.svelte.js";

	const { params } = $props();
	const gameId = () => params.gameId;

	const api = getClientApiContext();
	const gameStore = new GameAggregateStore({ api, gameId });
	const initPromise = gameStore.initAsync();
</script>

<Header class="bg-transparent shadow-none fixed inset-x-0 top-0 z-20">
	<div
		class="absolute inset-x-0 top-0 h-20 bg-linear-to-b from-neutral-950/90 to-transparent"
	></div>
	<div class="relative mr-auto w-fit pointer-events-auto">
		<LightButton
			variant="neutral"
			iconOnly
			onclick={() => history.back()}
		>
			<Icon>
				<ArrowLeftIcon />
			</Icon>
		</LightButton>
	</div>
</Header>

<AppLayout>
	<Main class="p-0!">
		{#await initPromise}
			<Spinner size="lg" />
		{:then}
			{#if !gameStore.game}
				<p class="text-error-light-fg">Game not found</p>
			{:else}
				<div class="relative">
					<div class="h-[40dvh] w-full overflow-hidden">
						<img
							src={resolve(`/api/assets/image/[...params]`, {
								params: GameAssets.parseBackgroundImageParams(gameStore.game.BackgroundImagePath),
							})}
							alt={`Background of ${gameStore.game.Name}`}
							loading="eager"
							decoding="sync"
							fetchpriority="high"
							class="h-full w-full object-cover filter blur-xs"
						/>
					</div>

					<div class="absolute left-6 bottom-0 translate-y-1/2 flex gap-4 items-end">
						<img
							src={resolve(`/api/assets/image/[...params]`, {
								params: GameAssets.parseCoverImageParams(gameStore.game.CoverImagePath),
							})}
							alt={`Cover of ${gameStore.game.Name}`}
							loading="eager"
							decoding="sync"
							fetchpriority="high"
							class="w-40 aspect-2/3 object-cover shadow-2xl"
						/>

						<div class="pb-4 pr-2">
							<h1 class="text-2xl font-semibold leading-tight">
								{gameStore.game.Name}
							</h1>

							<span class="text-sm">
								<span class="text-foreground/60">
									{gameStore.game.ReleaseDate?.getFullYear()}
								</span>
								{#if gameStore.developers.length > 0}
									•
									<span class="font-bold text-foreground/60">
										{gameStore.developers.map((d) => d.Name).join(", ")}
									</span>
								{/if}
							</span>
						</div>
					</div>
				</div>
				<div class="px-6 pt-36 pb-8 flex flex-col gap-4">
					<div class="flex items-start">
						{#if gameStore.completionStatus}
							<CompletionStatusButton completionStatus={gameStore.completionStatus} />
						{/if}
					</div>

					<SolidButton>Journal</SolidButton>
				</div>
			{/if}
		{/await}
	</Main>
</AppLayout>
