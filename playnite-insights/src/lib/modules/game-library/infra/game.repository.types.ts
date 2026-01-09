import type { Game } from '../domain/game.entity';

export type GameRepositoryIndex = 'byId' | 'bySourceUpdatedAt';

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
