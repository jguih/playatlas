<script lang="ts">
	/* eslint-disable svelte/no-at-html-tags */
	import { resolve } from "$app/paths";
	import { getClientApiContext } from "$lib/modules/bootstrap/application";
	import type { Game } from "$lib/modules/game-library/domain";
	import LightButton from "$lib/ui/components/buttons/LightButton.svelte";
	import Header from "$lib/ui/components/header/Header.svelte";
	import Icon from "$lib/ui/components/Icon.svelte";
	import AppLayout from "$lib/ui/components/layout/AppLayout.svelte";
	import Main from "$lib/ui/components/Main.svelte";
	import Spinner from "$lib/ui/components/Spinner.svelte";
	import { GameAssets } from "$lib/ui/state";
	import { ArrowLeftIcon } from "@lucide/svelte";

	const { params } = $props();
	const getParams = () => params;

	const api = getClientApiContext();
	const gamesPromise = api().GameLibrary.Query.GetGamesByIds.executeAsync({
		gameIds: [getParams().gameId],
	});
	let game: Game | undefined = $state();

	void gamesPromise.then((result) => {
		game = result.games.at(0);
	});
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
		{#await gamesPromise}
			<Spinner size="lg" />
		{:then}
			{#if !game}
				<p>Game not found</p>
			{:else}
				<div class="relative">
					<div class="h-[40dvh] w-full overflow-hidden">
						<img
							src={resolve(`/api/assets/image/[...params]`, {
								params: GameAssets.parseBackgroundImageParams(game.BackgroundImagePath),
							})}
							alt={`Background of ${game.Name}`}
							loading="eager"
							decoding="sync"
							fetchpriority="high"
							class="h-full w-full object-cover filter blur-xs"
						/>
					</div>

					<div class="absolute left-6 bottom-0 translate-y-1/2 flex gap-4 items-end">
						<img
							src={resolve(`/api/assets/image/[...params]`, {
								params: GameAssets.parseCoverImageParams(game.CoverImagePath),
							})}
							alt={`Cover of ${game.Name}`}
							loading="eager"
							decoding="sync"
							fetchpriority="high"
							class="w-40 aspect-2/3 object-cover shadow-2xl"
						/>

						<div class="pb-6">
							<h1 class="text-2xl font-semibold leading-tight">
								{game.Name}
							</h1>
						</div>
					</div>
				</div>
				<div class="px-6 pt-36 pb-8">
					{@html game.Description}
				</div>
			{/if}
		{/await}
	</Main>
</AppLayout>
