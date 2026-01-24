<script lang="ts">
	import { getClientApiContext } from "$lib/modules/bootstrap/application/client-api.context";
	import type { Game } from "$lib/modules/game-library/domain";
	import BottomNav from "$lib/ui/components/BottomNav.svelte";
	import LightButton from "$lib/ui/components/buttons/LightButton.svelte";
	import GameCard from "$lib/ui/components/game-card/GameCard.svelte";
	import Header from "$lib/ui/components/header/Header.svelte";
	import Icon from "$lib/ui/components/Icon.svelte";
	import AppLayout from "$lib/ui/components/layout/AppLayout.svelte";
	import Main from "$lib/ui/components/Main.svelte";
	import { HomeIcon, LayoutDashboardIcon, SettingsIcon } from "@lucide/svelte";
	import { onMount } from "svelte";

	type PageState = {
		games: Game[];
		loading: boolean;
		exhausted: boolean;
	};

	const api = getClientApiContext();
	let sentinel = $state<HTMLDivElement | undefined>(undefined);
	let nextKey: IDBValidKey | null = null;
	const pageState = $state<PageState>({
		games: [],
		loading: false,
		exhausted: false,
	});

	const loadMore = async () => {
		if (pageState.loading || pageState.exhausted) return;

		pageState.loading = true;

		try {
			const result = await api().GameLibrary.Query.GetGames.executeAsync({
				limit: 50,
				sort: "recent",
				cursor: nextKey,
			});

			pageState.games.push(...result.items);
			nextKey = result.nextKey;
			pageState.exhausted = result.nextKey === null;
		} finally {
			pageState.loading = false;
		}
	};

	onMount(() => {
		const observer = new IntersectionObserver(
			async ([entry]) => {
				if (entry.isIntersecting) {
					await loadMore();
				}
			},
			{
				root: null,
				rootMargin: "200px",
				threshold: 0.1,
			},
		);

		if (sentinel) observer.observe(sentinel);

		return () => observer.disconnect();
	});
</script>

<AppLayout>
	{#snippet header()}
		<Header></Header>
	{/snippet}
	{#snippet banner()}
		<div></div>
	{/snippet}

	<Main>
		<ul
			class={[
				"mb-6 grid list-none gap-2 p-0",
				["grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8"],
			]}
		>
			{#each pageState.games as game (game.Id)}
				<GameCard
					game={{
						id: game.Id,
						name: game.Name ?? "Unknown",
						coverImageFilePath: game.CoverImagePath,
					}}
				/>
			{/each}
		</ul>

		{#if pageState.loading}
			<p class="text-center text-sm text-neutral-light-fg mt-4">Loading...</p>
		{/if}
		<div bind:this={sentinel}></div>
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
