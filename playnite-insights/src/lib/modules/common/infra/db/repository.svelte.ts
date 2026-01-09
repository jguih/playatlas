import type { IndexedDbSignal } from '$lib/client/app-state/indexeddbManager.svelte';
import { IndexedDBNotInitializedError } from '../../errors/indexeddb-not-initialized.error';
import type { StoreNames } from './indexeddb';

export type IndexedDBRepositoryDeps = {
	indexedDbSignal: IndexedDbSignal;
};

export class IndexedDBRepository {
	#indexedDbSignal: IndexedDBRepositoryDeps['indexedDbSignal'];

	constructor({ indexedDbSignal }: IndexedDBRepositoryDeps) {
		this.#indexedDbSignal = indexedDbSignal;
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
}
