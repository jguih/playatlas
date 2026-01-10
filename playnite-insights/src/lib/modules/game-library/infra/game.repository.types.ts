import type { ClientRepositoryStoreName } from '$lib/modules/common/infra';
import type { Game } from '../domain/game.entity';

export type GameRepositoryIndex = 'bySourceUpdatedAt' | 'byDeletedAt';

export type GameRepositoryMeta = {
	storeName: ClientRepositoryStoreName;
	index: Record<GameRepositoryIndex, GameRepositoryIndex>;
};

export type GameQuery = {
	index: GameRepositoryIndex;
	direction?: 'next' | 'prev';
	afterKey?: IDBValidKey | null;
	limit: number;
};

export type GameQueryResult = {
	items: Game[];
	nextKey: IDBValidKey | null;
};
