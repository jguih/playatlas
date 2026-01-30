import type { Game, GameId } from "../../domain/game.entity";
import type { GameModel } from "../../infra/game.repository";

export type GameFilter = (game: GameModel) => boolean;

export type ScanSourceAsyncFn = (props: {
	batchSize: number;
	cursor: IDBValidKey | null;
}) => Promise<{
	items: Game[];
	keys: Map<GameId, IDBValidKey>;
}>;
