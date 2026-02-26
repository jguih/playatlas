<script lang="ts">
	import { afterNavigate, beforeNavigate } from "$app/navigation";
	import { getClientApiContext } from "$lib/modules/bootstrap/application/client-api.context";
	import type { CreateGameLibraryFilterCommand } from "$lib/modules/game-library/commands";
	import type { GameLibraryFilter } from "$lib/modules/game-library/domain";
	import {
		GameLibraryFiltersSidebar,
		GameLibraryPager,
		type GameLibraryPagerState,
		GameLibrarySearch,
		SyncProgressViewModel,
		gameLibraryPageScrollState,
	} from "$lib/page/game/library";
	import LightButton from "$lib/ui/components/buttons/LightButton.svelte";
	import GameCard from "$lib/ui/components/game-card/GameCard.svelte";
	import GameCardSkeleton from "$lib/ui/components/game-card/GameCardSkeleton.svelte";
	import Header from "$lib/ui/components/header/Header.svelte";
	import Icon from "$lib/ui/components/Icon.svelte";
	import AppLayout from "$lib/ui/components/layout/AppLayout.svelte";
	import Main from "$lib/ui/components/Main.svelte";
	import Sidebar from "$lib/ui/components/sidebar/Sidebar.svelte";
	import Spinner from "$lib/ui/components/Spinner.svelte";
	import { ArrowLeftIcon, ListFilter, SearchIcon } from "@lucide/svelte";
	import { onMount, tick } from "svelte";
	import SearchBottomSheet from "../../../lib/page/game/library/components/SearchBottomSheet.svelte";

	const api = getClientApiContext();
	const pager = new GameLibraryPager({ api });
	const filters = new GameLibraryFiltersSidebar();
	const search = new GameLibrarySearch();
	const syncProgress = $derived(api().Synchronization.SyncProgressReporter.progressSignal);
	const libraryFilterItems = $state<{ items: GameLibraryFilter[] }>({ items: [] });
	let sentinel = $state<HTMLDivElement | undefined>(undefined);
	let main = $state<HTMLElement | undefined>(undefined);

	const commitSearchAsync = async () => {
		const state = $state.snapshot(pager.pagerStateSignal) as unknown as GameLibraryPagerState;

		pager.setQuery({ mode: "query", filters: { search: state.query.filters.search } });
		await pager.loadMoreAsync();

		const command: CreateGameLibraryFilterCommand = {
			query: {
				filter: state.query.filters,
				sort: state.mode === "query" ? state.query.sort : { type: "recentlyUpdated" },
			},
		};

		await api().GameLibrary.Command.CreateGameLibraryFilter.executeAsync(command);
		await loadLibraryFiltersAsync();
	};

	const loadLibraryFiltersAsync = async () => {
		const { gameLibraryFilters } = await api().GameLibrary.Query.GetGameLibraryFilters.executeAsync(
			{
				sort: "recentlyUsed",
				sortOrder: "desc",
			},
		);
		libraryFilterItems.items = gameLibraryFilters;
	};

	onMount(() => {
		const observer = new IntersectionObserver(
			async ([entry]) => {
				if (entry.isIntersecting) {
					await pager.loadMoreAsync();
				}
			},
			{
				root: main,
				rootMargin: "600px 0px",
				threshold: 0,
			},
		);

		void (async () => {
			await tick();
			if (sentinel) observer.observe(sentinel);
		})();

		return () => observer.disconnect();
	});

	onMount(() => {
		void loadLibraryFiltersAsync();
	});

	beforeNavigate(() => {
		if (main) gameLibraryPageScrollState.y = main.scrollTop;
	});

	afterNavigate(() => {
		if (!main || gameLibraryPageScrollState.y === 0) return;

		const restore = () => {
			if (!main) return;

			if (main.scrollHeight > main.clientHeight) {
				main.scrollTo({ top: gameLibraryPageScrollState.y, behavior: "auto" });
			} else {
				requestAnimationFrame(restore);
			}
		};

		restore();
	});
</script>

{#if filters.shouldOpen}
	<Sidebar onClose={filters.close} />
{/if}

{#if search.shouldOpen}
	<SearchBottomSheet
		onClose={() => {
			void commitSearchAsync();
			search.close();
		}}
		bind:value={pager.pagerStateSignal.query.filters.search}
		libraryFilterItems={libraryFilterItems.items}
		onApplyFilterItem={async (item) => {
			pager.setQuery({ mode: "query", filters: { search: item.Query.filter?.search } });
			search.close();
			await pager.loadMoreAsync();
		}}
	/>
{/if}

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
					{:else}
						<LightButton
							variant="neutral"
							iconOnly
							onclick={() => history.back()}
						>
							<Icon>
								<ArrowLeftIcon />
							</Icon>
						</LightButton>
					{/if}
				</div>
				<div class="flex flex-nowrap">
					<LightButton
						variant="neutral"
						iconOnly={!pager.pagerStateSignal.query.filters.search}
						onclick={search.open}
						class="flex items-center gap-1 px-2!"
					>
						<Icon>
							<SearchIcon />
						</Icon>
						{#if pager.pagerStateSignal.query.filters.search}
							<span class="text-xs text-foreground/60 truncate max-w-12">
								{pager.pagerStateSignal.query.filters.search}
							</span>
						{/if}
					</LightButton>
					<LightButton
						variant="neutral"
						iconOnly
						onclick={filters.open}
					>
						<Icon>
							<ListFilter />
						</Icon>
					</LightButton>
				</div>
			</div>
		</Header>
	{/snippet}
	{#snippet banner()}
		<div></div>
	{/snippet}

	<Main bind:main>
		<ul
			class={[
				"mb-6 grid list-none gap-2 p-0 justify-center",
				["grid-cols-[repeat(auto-fill,minmax(9rem,1fr))]"],
			]}
		>
			{#each pager.pagerStateSignal.games as game (game.id)}
				<GameCard {game} />
			{/each}

			{#if pager.pagerStateSignal.loading}
				{#each Array.from({ length: 12 }, () => crypto.randomUUID()) as id (id)}
					<GameCardSkeleton />
				{/each}
			{/if}
		</ul>
		<div
			bind:this={sentinel}
			style="height: 1px;"
		></div>
	</Main>
</AppLayout>
