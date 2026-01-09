import type { ClientEntity } from '../common/client-entity';
import { IndexedDBNotInitializedError } from '../errors';
import type { IClientEntityRepository } from './client-entity.repository.port';
import type { IndexedDbSignal } from './client-entity.repository.types';
import type { StoreNames } from './db';

export type ClientEntityRepositoryDeps = {
	indexedDbSignal: IndexedDbSignal;
};

export class ClientEntityRepository<
	TEntity extends ClientEntity<TEntityKey>,
	TEntityKey extends IDBValidKey,
> implements IClientEntityRepository<TEntity, TEntityKey>
{
	#indexedDbSignal: ClientEntityRepositoryDeps['indexedDbSignal'];
	storeName: StoreNames;

	constructor({
		indexedDbSignal,
		storeName,
	}: ClientEntityRepositoryDeps & { storeName: StoreNames }) {
		this.#indexedDbSignal = indexedDbSignal;
		this.storeName = storeName;
	}

	/**
	 * Awaits for indexeddb to be ready before calling the callback
	 * @param callback the callback function
	 * @throws {IndexedDBNotInitializedError} if db is not ready after promise is complete
	 */
	protected async withDb<T>(callback: (db: IDBDatabase) => Promise<T>): Promise<T> {
		await this.#indexedDbSignal.dbReady;
		const db = this.#indexedDbSignal.db;
		if (!db) throw new IndexedDBNotInitializedError();
		return callback(db);
	}

	runTransaction = async <T>(
		storeName: StoreNames | StoreNames[],
		mode: IDBTransactionMode,
		callback: (props: { tx: IDBTransaction }) => Promise<T> | T,
	): Promise<T> => {
		return await this.withDb((db) => {
			return new Promise((resolve, reject) => {
				const tx = db.transaction(storeName, mode);

				tx.oncomplete = () => resolve(result);
				tx.onerror = () => reject(tx.error);
				tx.onabort = () => reject(tx.error);

				let result: T;
				try {
					result = callback({ tx }) as T;
				} catch (err) {
					tx.abort();
					reject(err);
				}
			});
		});
	};

	runRequest = <T>(req: IDBRequest<T>): Promise<T> => {
		return new Promise((resolve, reject) => {
			req.onsuccess = () => resolve(req.result);
			req.onerror = () => reject(req.error);
		});
	};

	addAsync: IClientEntityRepository<TEntity, TEntityKey>['addAsync'] = async (entity) => {
		await this.runTransaction([this.storeName], 'readwrite', async ({ tx }) => {
			const store = tx.objectStore(this.storeName);
			await this.runRequest(store.add(entity));
		});
	};

	putAsync: IClientEntityRepository<TEntity, TEntityKey>['putAsync'] = async (game) => {
		await this.runTransaction([this.storeName], 'readwrite', async ({ tx }) => {
			const store = tx.objectStore(this.storeName);
			await this.runRequest(store.put(game));
		});
	};

	deleteAsync: IClientEntityRepository<TEntity, TEntityKey>['deleteAsync'] = async (entityId) => {
		await this.runTransaction([this.storeName], 'readwrite', async ({ tx }) => {
			const store = tx.objectStore(this.storeName);
			await this.runRequest(store.delete(entityId));
		});
	};

	getByIdAsync: IClientEntityRepository<TEntity, TEntityKey>['getByIdAsync'] = async (entityId) => {
		return await this.runTransaction([this.storeName], 'readonly', async ({ tx }) => {
			const store = tx.objectStore(this.storeName);
			const entity = await this.runRequest<TEntity | undefined>(store.get(entityId));
			return entity ?? null;
		});
	};

	syncAsync: IClientEntityRepository<TEntity, TEntityKey>['syncAsync'] = async (entity) => {
		const entities = Array.isArray(entity) ? entity : [entity];
		if (entities.length === 0) return;

		await this.runTransaction([this.storeName], 'readwrite', async ({ tx }) => {
			const store = tx.objectStore(this.storeName);

			for (const entity of entities) {
				const existing = await this.runRequest<TEntity | undefined>(store.get(entity.Id));
				if (!existing || new Date(entity.SourceUpdatedAt) > new Date(existing.SourceUpdatedAt)) {
					await this.runRequest(store.put(entity));
				}
			}
		});
	};
}
