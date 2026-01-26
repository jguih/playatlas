<script lang="ts">
	import { resolve } from "$app/paths";
	import { getClientApiContext } from "$lib/modules/bootstrap/application";
	import CompletionStatusButton from "$lib/ui/components/buttons/CompletionStatusButton.svelte";
	import LightButton from "$lib/ui/components/buttons/LightButton.svelte";
	import SolidButton from "$lib/ui/components/buttons/SolidButton.svelte";
	import SolidChip from "$lib/ui/components/chip/SolidChip.svelte";
	import SyncStateChip from "$lib/ui/components/chip/SyncStateChip.svelte";
	import Header from "$lib/ui/components/header/Header.svelte";
	import Icon from "$lib/ui/components/Icon.svelte";
	import AppLayout from "$lib/ui/components/layout/AppLayout.svelte";
	import Main from "$lib/ui/components/Main.svelte";
	import Spinner from "$lib/ui/components/Spinner.svelte";
	import { GameAssets } from "$lib/ui/state";
	import { ArrowLeftIcon } from "@lucide/svelte";
	import { onMount, tick } from "svelte";
	import { cubicInOut } from "svelte/easing";
	import { fade } from "svelte/transition";
	import GameInfoSection from "./page/components/GameInfoSection.svelte";
	import { GameAggregateStore } from "./page/game-aggregate-store.svelte.js";

	const { params } = $props();
	const gameId = () => params.gameId;

	const api = getClientApiContext();
	const gameStore = new GameAggregateStore({ api, gameId });
	const initPromise = gameStore.initAsync();
	let heroTitleEl: HTMLElement | undefined = $state();
	let showHeaderTitle = $state(false);

	onMount(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				showHeaderTitle = !entry.isIntersecting;
			},
			{
				root: null,
				threshold: 0,
				rootMargin: "-72px 0px 0px 0px",
			},
		);

		void initPromise.then(async () => {
			await tick();
			if (heroTitleEl) observer.observe(heroTitleEl);
		});

		return () => observer.disconnect();
	});
</script>

<Header
	class={[
		"transition-colors-default fixed inset-x-0 top-0 z-20 border-b",
		showHeaderTitle
			? "bg-background-1 shadow border-b-neutral-700/60"
			: "bg-transparent shadow-none border-b-transparent",
	]}
>
	<div class="absolute inset-x-0 top-0 h-16 bg-linear-to-b from-black/60 to-transparent"></div>
	<div class="relative mr-auto w-fit pointer-events-auto flex items-center gap-1">
		<LightButton
			variant="neutral"
			iconOnly
			onclick={() => history.back()}
		>
			<Icon>
				<ArrowLeftIcon />
			</Icon>
		</LightButton>
		{#if showHeaderTitle}
			<p
				class={["font-semibold leading-tight text-lg truncate max-w-[70dvw]"]}
				transition:fade={{ duration: 150, easing: cubicInOut }}
			>
				{gameStore.game?.Name}
			</p>
		{/if}
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
					<div class="h-[50dvh] w-full overflow-hidden">
						<img
							src={resolve(`/api/assets/image/[...params]`, {
								params: GameAssets.parseBackgroundImageParams(gameStore.game.BackgroundImagePath),
							})}
							alt={`Background of ${gameStore.game.Name}`}
							loading="eager"
							decoding="sync"
							fetchpriority="high"
							class="h-full w-full object-cover blur-xs scale-105"
						/>

						<div class="absolute inset-0 bg-black/20 z-1"></div>

						<div
							class={[
								"absolute inset-x-0 -bottom-1 h-40 z-2",
								"bg-linear-to-t from-background via-background/80 to-transparent",
							]}
						></div>
					</div>

					<div class="absolute left-6 bottom-12 translate-y-1/2 flex gap-4 items-end z-3">
						<div class="relative min-w-40 max-w-40 aspect-2/3">
							<img
								src={resolve(`/api/assets/image/[...params]`, {
									params: GameAssets.parseCoverImageParams(gameStore.game.CoverImagePath),
								})}
								alt={`Cover of ${gameStore.game.Name}`}
								loading="eager"
								decoding="sync"
								fetchpriority="high"
								class="w-full h-full object-cover shadow-2xl"
							/>

							<div class="absolute right-2 bottom-2">
								<SyncStateChip
									{...gameStore.game.Sync}
									class="text-xs!"
								/>
							</div>
						</div>

						<div
							class="pb-2 pr-2"
							bind:this={heroTitleEl}
						>
							<h1 class="text-2xl font-semibold leading-tight drop-shadow-md mb-1">
								{gameStore.game.Name}
							</h1>

							{#if gameStore.game.ReleaseDate || gameStore.getCompaniesSummary().length > 0}
								<span class="text-sm">
									<span class="text-foreground/60">
										{gameStore.game.ReleaseDate?.getFullYear()}
									</span>
									{#if gameStore.game.ReleaseDate && gameStore.getCompaniesSummary().length > 0}
										•
									{/if}
									<span class="font-bold text-foreground/60">
										{gameStore.getCompaniesSummary()}
									</span>
								</span>
							{/if}
						</div>
					</div>
				</div>

				<div class="px-6 pt-24 pb-8 flex flex-col gap-4 z-3">
					<div class="flex items-start">
						{#if gameStore.completionStatus}
							<CompletionStatusButton completionStatus={gameStore.completionStatus} />
						{/if}
					</div>

					<SolidButton>Journal</SolidButton>

					<GameInfoSection
						title="Play State"
						class="flex gap-2 flex-col"
					>
						<div class="flex items-center gap-2 flex-nowrap min-w-0">
							<SolidChip variant={gameStore.game.IsInstalled ? "success" : "neutral"}>
								<span
									class={[
										"size-2 rounded-full",
										gameStore.game.IsInstalled ? "bg-success-bg" : "bg-foreground/40",
									]}
								></span>

								{gameStore.game.IsInstalled ? "Installed" : "Not installed"}
							</SolidChip>

							{#if gameStore.game.IsInstalled}
								{#if gameStore.game.InstallDirectory}
									<SolidChip
										class="bg-background-1! text-foreground/80! min-w-0 flex-1"
										title={gameStore.game.InstallDirectory}
									>
										📂
										<span class="truncate">
											{gameStore.game.InstallDirectory}
										</span>
									</SolidChip>
								{:else}
									<SolidChip
										variant="warning"
										class="min-w-0 flex-1"
									>
										<span class="truncate">⚠ Install path unavailable</span>
									</SolidChip>
								{/if}
							{/if}
						</div>
					</GameInfoSection>
				</div>
			{/if}
		{/await}
	</Main>
</AppLayout>
