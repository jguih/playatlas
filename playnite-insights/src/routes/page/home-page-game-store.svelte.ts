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

	private async withLoading<T>(
		section: keyof HomePageStoreState,
		fn: () => Promise<T>,
	): Promise<T> {
		this.storeSignal[section].loading = true;
		try {
			return await fn();
		} finally {
			this.storeSignal[section].loading = false;
		}
	}

	private loadHeroItemsAsync = async () => {
		return this.withLoading("hero", async () => {
			const ranked = await this.deps
				.api()
				.GameLibrary.RecommendationEngine.recommendForInstanceAsync({ limit: 6 });
			const gameIds = ranked.map((r) => r.gameId);
			const rankedMap = new SvelteMap(ranked.map((r) => [r.gameId, r.similarity]));

			const { games } = await this.deps.api().GameLibrary.Query.GetGamesByIds.executeAsync({
				gameIds,
			});

			const rankedGames = games
				.map((game) => ({
					Id: game.Id,
					Name: game.Playnite?.Name ?? "Unknown",
					CoverImageFilePath: game.Playnite?.CoverImagePath,
					Similarity: rankedMap.get(game.Id) ?? 0,
				}))
				.sort((a, b) => b.Similarity - a.Similarity);

			this.storeSignal.hero.items = rankedGames.sort((a, b) => b.Similarity - a.Similarity);
		});
	};

	loadGamesAsync = async () => {
		await this.loadHeroItemsAsync();
	};
}
