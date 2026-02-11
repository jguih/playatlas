<script lang="ts">
	import GameCard from "$lib/ui/components/game-card/GameCard.svelte";
	import GameCardSkeleton from "$lib/ui/components/game-card/GameCardSkeleton.svelte";
	import type { HomePageGameReadModel } from "../home-page-game-model";

	type HeroProps = {
		games: HomePageGameReadModel[];
		loading: boolean;
	};

	const { games, loading }: HeroProps = $props();
</script>

<section>
	<ul class={["mb-6 grid list-none gap-2 p-0 justify-center grid-cols-4"]}>
		{#each games as game, i (game.Id)}
			<GameCard
				game={{ id: game.Id, name: game.Name, coverImageFilePath: game.CoverImageFilePath }}
				displayName={false}
				class={[i < 2 && "col-span-2"]}
			/>
		{/each}

		{#if loading}
			{#each Array.from({ length: 4 }, () => crypto.randomUUID()) as id (id)}
				<GameCardSkeleton />
			{/each}
		{/if}
	</ul>
</section>
