import type { ClientEntity } from "../common/client-entity";
import type { IClientEntityMapper } from "../common/client-entity.mapper";
import type { IClientEntityRepository } from "./client-entity.repository.port";
import type { ClientRepositoryStoreName } from "./client-entity.repository.types";
import { IndexedDbRepository } from "./indexeddb.repository";

export type ClientEntityRepositoryDeps = {
	dbSignal: IDBDatabase;
};

export class ClientEntityRepository<
	TEntityKey extends IDBValidKey,
	TEntity extends ClientEntity<TEntityKey>,
	TModel,
>
	extends IndexedDbRepository
	implements IClientEntityRepository<TEntity, TEntityKey>
{
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
		super({ dbSignal });
		this.storeName = storeName;
		this.mapper = mapper;
	}

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
