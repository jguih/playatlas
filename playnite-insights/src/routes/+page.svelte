<script lang="ts">
	import { afterNavigate, beforeNavigate } from "$app/navigation";
	import { getClientApiContext } from "$lib/modules/bootstrap/application/client-api.context";
	import type { GetGamesQueryFilter, GetGamesQuerySort } from "$lib/modules/common/queries";
	import type { CreateGameLibraryFilterCommand } from "$lib/modules/game-library/commands";
	import BottomNav from "$lib/ui/components/BottomNav.svelte";
	import LightButton from "$lib/ui/components/buttons/LightButton.svelte";
	import GameCard from "$lib/ui/components/game-card/GameCard.svelte";
	import GameCardSkeleton from "$lib/ui/components/game-card/GameCardSkeleton.svelte";
	import Header from "$lib/ui/components/header/Header.svelte";
	import Icon from "$lib/ui/components/Icon.svelte";
	import AppLayout from "$lib/ui/components/layout/AppLayout.svelte";
	import Main from "$lib/ui/components/Main.svelte";
	import Sidebar from "$lib/ui/components/sidebar/Sidebar.svelte";
	import Spinner from "$lib/ui/components/Spinner.svelte";
	import {
		HomeIcon,
		LayoutDashboardIcon,
		ListFilter,
		SearchIcon,
		SettingsIcon,
	} from "@lucide/svelte";
	import { onMount, tick } from "svelte";
	import SearchBottomSheet from "./page/components/SearchBottomSheet.svelte";
	import { GameLibraryPager } from "./page/game-library-pager.svelte";
	import type { GameLibraryPagerLoadMoreProps } from "./page/game-library-pager.types";
	import {
		HomePageFilters,
		homePageFiltersSignal,
		homePageSortSignal,
	} from "./page/home-page-filters.svelte";
	import { homePageScrollState } from "./page/home-page-scroll-position.svelte";
	import { HomePageSearch } from "./page/home-page-search.svelte";
	import { SyncProgressViewModel } from "./page/sync-progress.view-model";

	const api = getClientApiContext();
	const pager = new GameLibraryPager({ api });
	const filters = new HomePageFilters();
	const search = new HomePageSearch();
	const syncProgress = $derived(api().GameLibrary.SyncProgressReporter.progressSignal);
	let reloadPagerTimeout: ReturnType<typeof setTimeout> | undefined = undefined;
	let sentinel = $state<HTMLDivElement | undefined>(undefined);
	let main = $state<HTMLElement | undefined>(undefined);

	const reloadPagerAsync = async (props: GameLibraryPagerLoadMoreProps = {}) => {
		pager.invalidateSignal();
		await pager.loadMore(props);
	};

	const clearReloadPagerTimeout = () => {
		if (reloadPagerTimeout !== undefined) {
			clearTimeout(reloadPagerTimeout);
			reloadPagerTimeout = undefined;
		}
	};

	const commitSearchAsync = async (command: CreateGameLibraryFilterCommand) => {
		const query = command.query;

		await Promise.allSettled([
			reloadPagerAsync({ filter: query.Filter ?? undefined, sort: query.Sort }),
			api().GameLibrary.Command.CreateGameLibraryFilter.executeAsync(command),
		]);
	};

	const reloadPagerDebounced = () => {
		clearReloadPagerTimeout();

		if (!homePageFiltersSignal.search) {
			void reloadPagerAsync();
			return;
		}

		reloadPagerTimeout = setTimeout(() => {
			void reloadPagerAsync();
			reloadPagerTimeout = undefined;
		}, 1_000);
	};

	onMount(() => {
		const observer = new IntersectionObserver(
			async ([entry]) => {
				if (entry.isIntersecting) {
					await pager.loadMore();
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
		const unsubscribe = api().EventBus.on("sync-finished", () => {
			if (pager.pagerStateSignal.games.length === 0) {
				void reloadPagerAsync();
			}
		});

		return () => unsubscribe();
	});

	beforeNavigate(() => {
		if (main) homePageScrollState.y = main.scrollTop;
	});

	afterNavigate(() => {
		if (!main || homePageScrollState.y === 0) return;

		const restore = () => {
			if (!main) return;

			if (main.scrollHeight > main.clientHeight) {
				main.scrollTo({ top: homePageScrollState.y, behavior: "auto" });
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
			clearReloadPagerTimeout();

			const command: CreateGameLibraryFilterCommand = {
				query: {
					Filter: $state.snapshot(homePageFiltersSignal) as unknown as GetGamesQueryFilter,
					Sort: $state.snapshot(homePageSortSignal) as unknown as GetGamesQuerySort,
				},
			};

			search.close();
			void commitSearchAsync(command);
		}}
		bind:value={homePageFiltersSignal.search}
		onChange={reloadPagerDebounced}
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
					{/if}
				</div>
				<div class="flex flex-nowrap">
					<LightButton
						variant="neutral"
						iconOnly={!homePageFiltersSignal.search}
						onclick={search.open}
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
