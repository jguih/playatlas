<script lang="ts">
	import { afterNavigate, beforeNavigate } from "$app/navigation";
	import { getClientApiContext } from "$lib/modules/bootstrap/application/client-api.context";
	import BottomNav from "$lib/ui/components/BottomNav.svelte";
	import LightButton from "$lib/ui/components/buttons/LightButton.svelte";
	import GameCard from "$lib/ui/components/game-card/GameCard.svelte";
	import Header from "$lib/ui/components/header/Header.svelte";
	import Icon from "$lib/ui/components/Icon.svelte";
	import AppLayout from "$lib/ui/components/layout/AppLayout.svelte";
	import Main from "$lib/ui/components/Main.svelte";
	import BottomSheet from "$lib/ui/components/sidebar/BottomSheet.svelte";
	import Sidebar from "$lib/ui/components/sidebar/Sidebar.svelte";
	import Spinner from "$lib/ui/components/Spinner.svelte";
	import { GameLibraryPager } from "$lib/ui/pager";
	import { HomePageFilters, homePageScrollState, HomePageSearch } from "$lib/ui/state";
	import {
		HomeIcon,
		LayoutDashboardIcon,
		ListFilter,
		SearchIcon,
		SettingsIcon,
	} from "@lucide/svelte";
	import { onMount, tick } from "svelte";

	const api = getClientApiContext();
	const gamePager = new GameLibraryPager({ api });
	const filters = new HomePageFilters();
	const search = new HomePageSearch();
	let sentinel = $state<HTMLDivElement | undefined>(undefined);
	let main = $state<HTMLElement | undefined>(undefined);

	onMount(() => {
		const observer = new IntersectionObserver(
			async ([entry]) => {
				if (entry.isIntersecting) {
					await gamePager.loadMore();
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
	<BottomSheet onClose={search.close} />
{/if}

<AppLayout>
	{#snippet header()}
		<Header>
			<div class="ml-auto block w-fit">
				<LightButton
					variant="neutral"
					iconOnly
					onclick={search.open}
				>
					<Icon>
						<SearchIcon />
					</Icon>
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
			{#each gamePager.pagerStateSignal.games as game (game.id)}
				<GameCard {game} />
			{/each}
		</ul>

		{#if gamePager.pagerStateSignal.loading}
			<div class="w-fit block mx-auto">
				<Spinner />
			</div>
		{/if}
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
