import type { ClientEntity } from "../common/client-entity";
import type { IClientEntityMapper } from "../common/client-entity.mapper";
import type { IClientEntityRepository } from "./client-entity.repository.port";
import type { ClientRepositoryStoreName } from "./client-entity.repository.types";
import { IndexedDbRepository } from "./indexeddb.repository";

export type ClientEntityRepositoryDeps<
	TEntityKey extends IDBValidKey,
	TEntity extends ClientEntity<TEntityKey>,
	TModel,
> = {
	dbSignal: IDBDatabase;
	storeName: ClientRepositoryStoreName;
	mapper: IClientEntityMapper<TEntityKey, TEntity, TModel>;
	shouldIgnore?: (entity: TEntity) => boolean;
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
	protected readonly shouldIgnore?: (entity: TEntity) => boolean;

	constructor({
		dbSignal,
		storeName,
		mapper,
		shouldIgnore,
	}: ClientEntityRepositoryDeps<TEntityKey, TEntity, TModel>) {
		super({ dbSignal });
		this.storeName = storeName;
		this.mapper = mapper;
		this.shouldIgnore = shouldIgnore;
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

			if (model) {
				const entity = this.mapper.toDomain(model);
				if (this.shouldIgnore?.(entity)) return null;
				return entity;
			}

			return null;
		});
	};

	getByIdsAsync: IClientEntityRepository<TEntity, TEntityKey>["getByIdsAsync"] = async (
		entityId,
	) => {
		const ids = Array.isArray(entityId) ? entityId : [entityId];

		return await this.runTransaction([this.storeName], "readonly", async ({ tx }) => {
			const store = tx.objectStore(this.storeName);

			const entries = await Promise.all(
				ids.map(async (id) => {
					const model = await this.runRequest(store.get(id));

					if (model) {
						const entity = this.mapper.toDomain(model);
						if (this.shouldIgnore?.(entity)) return undefined;
						return [id, entity];
					}

					return undefined;
				}),
			);

			return new Map(entries.filter(Boolean) as [TEntityKey, TEntity][]);
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
