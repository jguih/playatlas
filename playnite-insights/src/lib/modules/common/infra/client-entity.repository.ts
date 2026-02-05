import type { ClientEntity } from "../common/client-entity";
import type { IClientEntityMapper } from "../common/client-entity.mapper";
import type { IClientEntityRepository } from "./client-entity.repository.port";
import type { ClientRepositoryStoreName } from "./client-entity.repository.types";

export type ClientEntityRepositoryDeps = {
	dbSignal: IDBDatabase;
};

export class ClientEntityRepository<
	TEntityKey extends IDBValidKey,
	TEntity extends ClientEntity<TEntityKey>,
	TModel,
> implements IClientEntityRepository<TEntity, TEntityKey> {
	private readonly dbSignal: IDBDatabase;
	protected readonly storeName: ClientRepositoryStoreName;
	protected readonly mapper: IClientEntityMapper<TEntityKey, TEntity, TModel>;

	constructor({
		dbSignal,
		storeName,
		mapper,
	}: ClientEntityRepositoryDeps & {
		storeName: ClientRepositoryStoreName;
		mapper: IClientEntityMapper<TEntityKey, TEntity, TModel>;
	}) {
		this.dbSignal = dbSignal;
		this.storeName = storeName;
		this.mapper = mapper;
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
			const model = this.mapper.toPersistence(entity);
			await this.runRequest(store.add(model));
		});
	};

	putAsync: IClientEntityRepository<TEntity, TEntityKey>["putAsync"] = async (entity) => {
		await this.runTransaction([this.storeName], "readwrite", async ({ tx }) => {
			const store = tx.objectStore(this.storeName);
			const model = this.mapper.toPersistence(entity);
			await this.runRequest(store.put(model));
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
			const model = await this.runRequest<TModel | undefined>(store.get(entityId));
			return model ? this.mapper.toDomain(model) : null;
		});
	};

	getByIdsAsync: IClientEntityRepository<TEntity, TEntityKey>["getByIdsAsync"] = async (
		entityId,
	) => {
		const ids = Array.isArray(entityId) ? entityId : [entityId];

		return await this.runTransaction([this.storeName], "readonly", async ({ tx }) => {
			const store = tx.objectStore(this.storeName);

			const requests = ids.map((key) => this.runRequest<TModel | undefined>(store.get(key)));

			const results = await Promise.all(requests);

			return results.filter((e) => e !== undefined).map(this.mapper.toDomain);
		});
	};

	syncAsync: IClientEntityRepository<TEntity, TEntityKey>["syncAsync"] = async (entity) => {
		const entities = Array.isArray(entity) ? entity : [entity];
		if (entities.length === 0) return;

		await this.runTransaction([this.storeName], "readwrite", async ({ tx }) => {
			const store = tx.objectStore(this.storeName);

			for (const entity of entities) {
				const existing = await this.runRequest<TModel | undefined>(store.get(entity.Id));
				const existingEntity = existing ? this.mapper.toDomain(existing) : null;

				if (!existingEntity || entity.SourceLastUpdatedAt > existingEntity.SourceLastUpdatedAt) {
					const model = this.mapper.toPersistence(entity);
					await this.runRequest(store.put(model));
				}
			}
		});
	};
}
