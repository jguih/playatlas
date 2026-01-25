import type { ClientApiGetter } from "$lib/modules/bootstrap/application";
import type { GameCardProjection } from "../components/game-card/game-card.projection";

export type GameLibraryPagerState = {
	games: GameCardProjection[];
	nextKey: IDBValidKey | null;
	loading: boolean;
	exhausted: boolean;
};

export type GameLibraryPagerDeps = {
	api: ClientApiGetter;
};

export const pagerStateSignal = $state<GameLibraryPagerState>({
	games: [],
	nextKey: null,
	loading: false,
	exhausted: false,
});

export class GameLibraryPager {
	readonly pagerStateSignal: GameLibraryPagerState;
	private readonly api: ClientApiGetter;

	constructor({ api }: GameLibraryPagerDeps) {
		this.pagerStateSignal = pagerStateSignal;
		this.api = api;
	}

	loadMore = async () => {
		if (this.pagerStateSignal.loading || this.pagerStateSignal.exhausted) return;

		this.pagerStateSignal.loading = true;

		try {
			const snapshot = $state.snapshot(this.pagerStateSignal) as unknown as GameLibraryPagerState;

			const result = await this.api().GameLibrary.Query.GetGames.executeAsync({
				limit: 50,
				sort: "recent",
				cursor: snapshot.nextKey,
			});

			const cardProjectionItems = result.items.map(
				(i) =>
					({
						id: i.Id,
						name: i.Name ?? "Unknown",
						coverImageFilePath: i.CoverImagePath,
					}) satisfies GameCardProjection,
			);

			this.pagerStateSignal.games.push(...cardProjectionItems);
			this.pagerStateSignal.nextKey = result.nextKey;
			this.pagerStateSignal.exhausted = result.nextKey === null;
		} finally {
			this.pagerStateSignal.loading = false;
		}
	};
}
