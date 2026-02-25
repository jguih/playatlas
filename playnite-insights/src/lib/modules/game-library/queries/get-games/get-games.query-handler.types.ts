import type { GameId, SortDirection } from "$lib/modules/common/domain";
import type { Game } from "../../domain/game.entity";

export type GameFilter = (game: Game) => boolean;

export type ScanSourceAsyncFn = (props: {
	batchSize: number;
	cursor: IDBValidKey | null;
	direction?: SortDirection;
}) => Promise<{
	items: Game[];
	keys: Map<GameId, IDBValidKey>;
}>;
