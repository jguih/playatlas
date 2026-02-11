<script lang="ts">
	import { getClientApiContext } from "$lib/modules/bootstrap/application";
	import type { Game } from "$lib/modules/game-library/domain";
	import BottomNav from "$lib/ui/components/BottomNav.svelte";
	import LightButton from "$lib/ui/components/buttons/LightButton.svelte";
	import Header from "$lib/ui/components/header/Header.svelte";
	import Icon from "$lib/ui/components/Icon.svelte";
	import AppLayout from "$lib/ui/components/layout/AppLayout.svelte";
	import Main from "$lib/ui/components/Main.svelte";
	import Spinner from "$lib/ui/components/Spinner.svelte";
	import { HomeIcon, LayoutDashboardIcon, SettingsIcon } from "@lucide/svelte";
	import { onMount } from "svelte";
	import { SyncProgressViewModel } from "./game/library/page/sync-progress.view-model";

	const api = getClientApiContext();
	const syncProgress = $derived(api().Synchronization.SyncProgressReporter.progressSignal);
	const recommendationsPromise = api().GameLibrary.RecommendationEngine.recommendAsync(10);
	let rankedGames: Game[] = $state([]);

	onMount(() => {
		void recommendationsPromise.then(async (ranked) => {
			const result = await api().GameLibrary.Query.GetGamesByIds.executeAsync({
				gameIds: ranked.map((r) => r.gameId),
			});
			rankedGames = result.games;
		});
	});

	$inspect(rankedGames);
</script>

<AppLayout>
	{#snippet header()}
		<Header>
			<div class="flex justify-between items-center flex-nowrap">
				<div class="min-w-16 flex gap-2 text-xs flex-nowrap">
					{#if syncProgress.running}
						<Spinner
							size="sm"
							variant="primary"
						/>
						<p class="font-medium text-foreground/80">
							{SyncProgressViewModel.getSyncProgressLabel(syncProgress.activeFlow)}
						</p>
					{/if}
				</div>
				<div class="flex flex-nowrap"></div>
			</div>
		</Header>
	{/snippet}
	{#snippet banner()}
		<div></div>
	{/snippet}

	<Main></Main>

	{#snippet bottomNav()}
		<BottomNav>
			<LightButton
				size="lg"
				iconOnly
				state="active"
				aria-label="Home"
			>
				<Icon>
					<HomeIcon />
				</Icon>
			</LightButton>
			<LightButton
				size="lg"
				variant="neutral"
				iconOnly
				aria-label="Dashboard"
			>
				<Icon>
					<LayoutDashboardIcon />
				</Icon>
			</LightButton>
			<LightButton
				size="lg"
				variant="neutral"
				iconOnly
				aria-label="Settings"
			>
				<Icon>
					<SettingsIcon />
				</Icon>
			</LightButton>
		</BottomNav>
	{/snippet}
</AppLayout>
