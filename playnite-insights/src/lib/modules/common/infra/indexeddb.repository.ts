import type { ClientRepositoryStoreName } from "./client-entity.repository.types";

export type IndexedDbRepositoryDeps = {
	dbSignal: IDBDatabase;
};

export class IndexedDbRepository {
	constructor(private readonly innerDeps: IndexedDbRepositoryDeps) {}

	runTransaction = async <T>(
		storeName: ClientRepositoryStoreName | ClientRepositoryStoreName[],
		mode: IDBTransactionMode,
		callback: (props: { tx: IDBTransaction }) => Promise<T> | T,
	): Promise<T> => {
		return new Promise((resolve, reject) => {
			const tx = this.innerDeps.dbSignal.transaction(storeName, mode);

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
	};

	runRequest = <T>(req: IDBRequest<T>): Promise<T> => {
		return new Promise((resolve, reject) => {
			req.onsuccess = () => resolve(req.result);
			req.onerror = () => reject(req.error);
		});
	};
}
