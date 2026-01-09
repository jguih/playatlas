import type { IIndexedDbSchema } from '$lib/modules/common/infra';
import type { GameRepositoryMeta } from './game.repository.types';

export const gameRepositoryMeta: GameRepositoryMeta = {
	storeName: 'games',
	index: {
		byId: 'byId',
		bySourceUpdatedAt: 'bySourceUpdatedAt',
		byDeletedAt: 'byDeletedAt',
	},
};

export const gameRepositorySchema: IIndexedDbSchema = {
	define({ db, oldVersion }) {
		if (oldVersion < 1) {
			const store = db.createObjectStore(gameRepositoryMeta.storeName, { keyPath: 'Id' });
			store.createIndex(gameRepositoryMeta.index.bySourceUpdatedAt, 'SourceUpdatedAt');
			store.createIndex(gameRepositoryMeta.index.byDeletedAt, 'DeletedAt');
		}
	},
};
