<script lang="ts">
	import { getClientApiContext } from "$lib/modules/bootstrap/application/client-api.context";
	import BottomNav from "$lib/ui/components/BottomNav.svelte";
	import LightButton from "$lib/ui/components/buttons/LightButton.svelte";
	import GameCard from "$lib/ui/components/game-card/GameCard.svelte";
	import Header from "$lib/ui/components/header/Header.svelte";
	import Icon from "$lib/ui/components/Icon.svelte";
	import AppLayout from "$lib/ui/components/layout/AppLayout.svelte";
	import Main from "$lib/ui/components/Main.svelte";
	import Spinner from "$lib/ui/components/Spinner.svelte";
	import { GameLibraryPager } from "$lib/ui/pager";
	import { HomeIcon, LayoutDashboardIcon, SettingsIcon } from "@lucide/svelte";
	import { onMount } from "svelte";

	const api = getClientApiContext();
	const gamePager = new GameLibraryPager({ api });
	let sentinel = $state<HTMLDivElement | undefined>(undefined);

	onMount(() => {
		const observer = new IntersectionObserver(
			async ([entry]) => {
				if (entry.isIntersecting) {
					await gamePager.loadMore();
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
