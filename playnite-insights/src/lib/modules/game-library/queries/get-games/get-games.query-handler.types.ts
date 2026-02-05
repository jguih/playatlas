import type { GetGamesQuerySortDirection } from "$lib/modules/common/queries";
import type { Game, GameId } from "../../domain/game.entity";

export type GameFilter = (game: Game) => boolean;

export type ScanSourceAsyncFn = (props: {
	batchSize: number;
	cursor: IDBValidKey | null;
	direction?: GetGamesQuerySortDirection;
}) => Promise<{
	items: Game[];
	keys: Map<GameId, IDBValidKey>;
}>;
