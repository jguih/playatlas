import type { ClientApiGetter } from "$lib/modules/bootstrap/application";
import type { GetGamesQueryFilter, GetGamesQuerySort } from "$lib/modules/common/queries";
import type { GameCardProjection } from "../../lib/ui/components/game-card/game-card.projection";
import type { GameLibraryPagerLoadMoreProps } from "./game-library-pager.types";
import { homePageFiltersSignal, homePageSortSignal } from "./home-page-filters.svelte";

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

	loadMore = async (props: GameLibraryPagerLoadMoreProps = {}) => {
		if (this.pagerStateSignal.loading || this.pagerStateSignal.exhausted) return;

		const { filter, sort } = props;

		this.pagerStateSignal.loading = true;

		try {
			const pagerSnapshot = $state.snapshot(
				this.pagerStateSignal,
			) as unknown as GameLibraryPagerState;
			const filterSnapshot =
				filter ?? ($state.snapshot(homePageFiltersSignal) as unknown as GetGamesQueryFilter);
			const sortSnapshot =
				sort ?? ($state.snapshot(homePageSortSignal) as unknown as GetGamesQuerySort);
			const cursor = pagerSnapshot.nextKey;

			const result = await this.api().GameLibrary.Query.GetGames.executeAsync({
				limit: 50,
				sort: sortSnapshot,
				cursor,
				filter: filterSnapshot,
			});

			const cardProjectionItems = result.items.map(
				(i) =>
					({
						id: i.Id,
						name: i.Playnite?.Name ?? "Unknown",
						coverImageFilePath: i.Playnite?.CoverImagePath,
					}) satisfies GameCardProjection,
			);

			this.pagerStateSignal.games.push(...cardProjectionItems);
			this.pagerStateSignal.nextKey = result.nextKey;
			this.pagerStateSignal.exhausted = result.nextKey === null;
		} finally {
			this.pagerStateSignal.loading = false;
		}
	};

	invalidateSignal = () => {
		if (this.pagerStateSignal.loading) return;

		this.pagerStateSignal.exhausted = false;
		this.pagerStateSignal.games = [];
		this.pagerStateSignal.loading = false;
		this.pagerStateSignal.nextKey = null;
	};
}
