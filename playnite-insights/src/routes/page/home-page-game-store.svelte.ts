import type { ClientApiGetter } from "$lib/modules/bootstrap/application";
import { SvelteMap } from "svelte/reactivity";
import type { HomePageGameReadModel } from "./home-page-game-model";
import type { HomePageSection } from "./home-page-section-key";

export type HomePageStoreDeps = {
	api: ClientApiGetter;
};

type HomePageStoreState = Record<
	HomePageSection,
	{ loading: boolean; items: HomePageGameReadModel[] }
>;

export class HomePageStore {
	storeSignal: HomePageStoreState = $state({ hero: { loading: false, items: [] } });

	constructor(private readonly deps: HomePageStoreDeps) {}

	private loadHeroItemsAsync = async () => {
		try {
			this.storeSignal.hero.loading = true;
			const ranked = await this.deps.api().GameLibrary.RecommendationEngine.recommendAsync(6);
			const gameIds = ranked.map((r) => r.gameId);
			const rankedMap = new SvelteMap(ranked.map((r) => [r.gameId, r.similarity]));

			const { games } = await this.deps.api().GameLibrary.Query.GetGamesByIds.executeAsync({
				gameIds,
			});
			const rankedGames: HomePageGameReadModel[] = [];

			for (const game of games) {
				rankedGames.push({
					Id: game.Id,
					Name: game.Playnite?.Name ?? "Unknown",
					CoverImageFilePath: game.Playnite?.CoverImagePath,
					Similarity: rankedMap.get(game.Id) ?? 0,
				});
			}

			this.storeSignal.hero.items = rankedGames.sort((a, b) => b.Similarity - a.Similarity);
		} finally {
			this.storeSignal.hero.loading = false;
		}
	};

	loadGamesAsync = async () => {
		await this.loadHeroItemsAsync();
	};
}
