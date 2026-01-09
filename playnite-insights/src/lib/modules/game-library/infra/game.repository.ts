import {
	IndexedDBRepository,
	type IndexedDBRepositoryDeps,
} from '$lib/modules/common/infra/db/repository.svelte';
import type { Game } from '../domain/game.entity';
import type { IGameRepositoryPort } from './game.repository.port';
import type { GameQueryResult, GameRepositoryIndex } from './game.repository.types';

export type GameRepositoryDeps = IndexedDBRepositoryDeps;

export class GameRepository extends IndexedDBRepository implements IGameRepositoryPort {
	static STORE_NAME = 'games' as const;

	static INDEX = {
		byId: 'byId',
		bySourceUpdatedAt: 'bySourceUpdatedAt',
	} satisfies Record<GameRepositoryIndex, GameRepositoryIndex>;

	static FILTER_BY = {
		Id: 'Id',
	} as const;

	constructor({ indexedDbSignal }: GameRepositoryDeps) {
		super({ indexedDbSignal });
	}

	addAsync: IGameRepositoryPort['addAsync'] = async (game) => {
		await this.runTransaction([GameRepository.STORE_NAME], 'readwrite', async ({ tx }) => {
			const gamesStore = tx.objectStore(GameRepository.STORE_NAME);
			await this.runRequest(gamesStore.add(game));
		});
	};

	putAsync: IGameRepositoryPort['putAsync'] = async (game) => {
		await this.runTransaction([GameRepository.STORE_NAME], 'readwrite', async ({ tx }) => {
			const gamesStore = tx.objectStore(GameRepository.STORE_NAME);
			await this.runRequest(gamesStore.put(game));
		});
	};

	deleteAsync: IGameRepositoryPort['deleteAsync'] = async (gameId) => {
		await this.runTransaction([GameRepository.STORE_NAME], 'readwrite', async ({ tx }) => {
			const gamesStore = tx.objectStore(GameRepository.STORE_NAME);
			await this.runRequest(gamesStore.delete(gameId));
		});
	};

	getByIdAsync: IGameRepositoryPort['getByIdAsync'] = async (gameId) => {
		return await this.runTransaction([GameRepository.STORE_NAME], 'readonly', async ({ tx }) => {
			const gamesStore = tx.objectStore(GameRepository.STORE_NAME);
			const game = await this.runRequest<Game | undefined>(gamesStore.get(gameId));
			return game ?? null;
		});
	};

	syncAsync: IGameRepositoryPort['syncAsync'] = async (game) => {
		const games = Array.isArray(game) ? game : [game];
		if (games.length === 0) return;

		await this.runTransaction([GameRepository.STORE_NAME], 'readwrite', async ({ tx }) => {
			const store = tx.objectStore(GameRepository.STORE_NAME);

			for (const game of games) {
				const existing = await this.runRequest<Game | undefined>(store.get(game.Id));
				if (!existing || new Date(game.SourceUpdatedAt) > new Date(existing.SourceUpdatedAt)) {
					await this.runRequest(store.put(game));
				}
			}
		});
	};

	queryAsync: IGameRepositoryPort['queryAsync'] = async ({
		index,
		direction = 'prev',
		afterKey = null,
		limit,
	}) => {
		return await this.runTransaction([GameRepository.STORE_NAME], 'readonly', async ({ tx }) => {
			const store = tx.objectStore(GameRepository.STORE_NAME);
			const idx = store.index(index);

			const items: Game[] = [];
			let nextKey: IDBValidKey | null = null;

			const range = afterKey ? IDBKeyRange.lowerBound(afterKey, true) : null;

			return await new Promise<GameQueryResult>((resolve, reject) => {
				const request = idx.openCursor(range, direction);

				request.onerror = () => reject(request.error);

				request.onsuccess = () => {
					const cursor = request.result;
					if (!cursor) {
						resolve({ items, nextKey: null });
						return;
					}

					const game: Game = cursor.value;
					if (!game.DeletedAt) items.push(cursor.value);

					if (items.length === limit) {
						nextKey = cursor.key;
						resolve({ items, nextKey });
						return;
					}

					cursor.continue();
				};
			});
		});
	};

	static defineSchema = ({
		db,
	}: {
		db: IDBDatabase;
		tx: IDBTransaction;
		oldVersion: number;
		newVersion: number | null;
	}): void => {
		if (!db.objectStoreNames.contains(this.STORE_NAME)) {
			const store = db.createObjectStore(this.STORE_NAME, { keyPath: 'Id' });
			store.createIndex(this.INDEX.byId, 'Id', { unique: true });
			store.createIndex(this.INDEX.bySourceUpdatedAt, 'SourceUpdatedAt');
		}

		// Future migrations
	};
}
