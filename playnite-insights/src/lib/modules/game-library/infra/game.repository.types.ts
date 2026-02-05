import type { ClientRepositoryStoreName } from "$lib/modules/common/infra";
import type { Game, GameId } from "../domain/game.entity";

export type GameRepositoryIndex = "bySourceLastUpdatedAt" | "byDeletedAt";

export type GameRepositoryMeta = {
	storeName: ClientRepositoryStoreName;
	index: Record<GameRepositoryIndex, GameRepositoryIndex>;
};

export type GameQuery = {
	index: GameRepositoryIndex;
	direction: IDBCursorDirection;
	range: IDBKeyRange | null;
	limit: number;
};

export type GameQueryResult = {
	items: Game[];
	keys: Map<GameId, IDBValidKey>;
	nextKey: IDBValidKey | null;
};
