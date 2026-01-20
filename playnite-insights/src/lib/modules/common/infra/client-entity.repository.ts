import type { ClientEntity } from "../common/client-entity";
import type { IClientEntityRepository } from "./client-entity.repository.port";
import type { ClientRepositoryStoreName } from "./client-entity.repository.types";

export type ClientEntityRepositoryDeps = {
	dbSignal: IDBDatabase;
};

export class ClientEntityRepository<
	TEntity extends ClientEntity<TEntityKey>,
	TEntityKey extends IDBValidKey,
> implements IClientEntityRepository<TEntity, TEntityKey>
{
	private readonly dbSignal: IDBDatabase;
	protected readonly storeName: ClientRepositoryStoreName;

	constructor({
		dbSignal,
		storeName,
	}: ClientEntityRepositoryDeps & { storeName: ClientRepositoryStoreName }) {
		this.dbSignal = dbSignal;
		this.storeName = storeName;
	}

	runTransaction = async <T>(
		storeName: ClientRepositoryStoreName | ClientRepositoryStoreName[],
		mode: IDBTransactionMode,
		callback: (props: { tx: IDBTransaction }) => Promise<T> | T,
	): Promise<T> => {
		return new Promise((resolve, reject) => {
			const tx = this.dbSignal.transaction(storeName, mode);

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

	addAsync: IClientEntityRepository<TEntity, TEntityKey>["addAsync"] = async (entity) => {
		await this.runTransaction([this.storeName], "readwrite", async ({ tx }) => {
			const store = tx.objectStore(this.storeName);
			await this.runRequest(store.add(entity));
		});
	};

	putAsync: IClientEntityRepository<TEntity, TEntityKey>["putAsync"] = async (game) => {
		await this.runTransaction([this.storeName], "readwrite", async ({ tx }) => {
			const store = tx.objectStore(this.storeName);
			await this.runRequest(store.put(game));
		});
	};

	deleteAsync: IClientEntityRepository<TEntity, TEntityKey>["deleteAsync"] = async (entityId) => {
		await this.runTransaction([this.storeName], "readwrite", async ({ tx }) => {
			const store = tx.objectStore(this.storeName);
			await this.runRequest(store.delete(entityId));
		});
	};

	getByIdAsync: IClientEntityRepository<TEntity, TEntityKey>["getByIdAsync"] = async (entityId) => {
		return await this.runTransaction([this.storeName], "readonly", async ({ tx }) => {
			const store = tx.objectStore(this.storeName);
			const entity = await this.runRequest<TEntity | undefined>(store.get(entityId));
			return entity ?? null;
		});
	};

	getByIdsAsync: IClientEntityRepository<TEntity, TEntityKey>["getByIdsAsync"] = async (
		entityId,
	) => {
		const ids = Array.isArray(entityId) ? entityId : [entityId];

		return await this.runTransaction([this.storeName], "readonly", async ({ tx }) => {
			const store = tx.objectStore(this.storeName);

			const requests = ids.map((key) => this.runRequest<TEntity | undefined>(store.get(key)));

			const results = await Promise.all(requests);

			return results.filter((e) => e !== undefined);
		});
	};

	syncAsync: IClientEntityRepository<TEntity, TEntityKey>["syncAsync"] = async (entity) => {
		const entities = Array.isArray(entity) ? entity : [entity];
		if (entities.length === 0) return;

		await this.runTransaction([this.storeName], "readwrite", async ({ tx }) => {
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
