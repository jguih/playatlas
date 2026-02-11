<script lang="ts">
	import { getClientApiContext } from "$lib/modules/bootstrap/application";
	import BottomNav from "$lib/ui/components/BottomNav.svelte";
	import LightButton from "$lib/ui/components/buttons/LightButton.svelte";
	import Header from "$lib/ui/components/header/Header.svelte";
	import Icon from "$lib/ui/components/Icon.svelte";
	import AppLayout from "$lib/ui/components/layout/AppLayout.svelte";
	import Main from "$lib/ui/components/Main.svelte";
	import Spinner from "$lib/ui/components/Spinner.svelte";
	import { HomeIcon, LayoutDashboardIcon, SearchIcon, SettingsIcon } from "@lucide/svelte";
	import { onMount } from "svelte";
	import { homePageFiltersSignal } from "./game/library/page/home-page-filters.svelte";
	import { SyncProgressViewModel } from "./game/library/page/sync-progress.view-model";
	import HomePageHero from "./page/components/HomePageHero.svelte";
	import { HomePageStore } from "./page/home-page-game-store.svelte";

	const api = getClientApiContext();
	const syncProgress = $derived(api().Synchronization.SyncProgressReporter.progressSignal);
	const store = new HomePageStore({ api });

	void store.loadGamesAsync();

	onMount(() => {
		const unsubscribe = api().EventBus.on("sync-finished", () => {
			if (store.storeSignal.hero.items.length === 0) {
				void store.loadGamesAsync();
			}
		});

		return () => unsubscribe();
	});
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
				<div class="flex flex-nowrap">
					<LightButton
						variant="neutral"
						iconOnly={!homePageFiltersSignal.search}
						class="flex items-center gap-1 px-2!"
					>
						<Icon>
							<SearchIcon />
						</Icon>
						{#if homePageFiltersSignal.search}
							<span class="text-xs text-foreground/60 truncate max-w-12">
								{homePageFiltersSignal.search}
							</span>
						{/if}
					</LightButton>
				</div>
			</div>
		</Header>
	{/snippet}
	{#snippet banner()}
		<div></div>
	{/snippet}

	<Main>
		<HomePageHero
			games={store.storeSignal.hero.items}
			loading={store.storeSignal.hero.loading}
		/>
	</Main>

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
