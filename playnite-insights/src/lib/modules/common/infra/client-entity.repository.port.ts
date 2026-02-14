import type { ClientEntity } from "../common/client-entity";

export interface IClientEntityRepository<
	TEntity extends ClientEntity<TEntityKey>,
	TEntityKey extends IDBValidKey,
> {
	/**
	 * Add an entity
	 * @returns The entity key if created successfully
	 * @throws {IndexedDBNotInitializedError} If the DB is not ready
	 * @throws {DOMException} If a transaction fails
	 */
	addAsync: (entity: TEntity) => Promise<void>;
	/**
	 * Updates an entity, will create it if missing
	 * @returns `true` on success, `false` otherwise
	 * @throws {IndexedDBNotInitializedError} If the DB is not ready
	 * @throws {DOMException} If a transaction fails
	 */
	putAsync: (entity: TEntity) => Promise<void>;
	/**
	 * Deletes an entity
	 * @returns `true` on success, `false` otherwise
	 * @throws {IndexedDBNotInitializedError} If the DB is not ready
	 * @throws {DOMException} If a transaction fails
	 */
	deleteAsync: (entityId: TEntityKey) => Promise<void>;
	/**
	 * Finds and returns an entity by its id
	 * @returns The entity or `null` when not found
	 * @throws {IndexedDBNotInitializedError} If the DB is not ready
	 * @throws {DOMException} If a transaction fails
	 */
	getByIdAsync: (entityId: TEntityKey) => Promise<TEntity | null>;
	/**
	 * Finds and returns entities by its ids
	 * @returns An array of entities
	 * @throws {IndexedDBNotInitializedError} If the DB is not ready
	 * @throws {DOMException} If a transaction fails
	 */
	getByIdsAsync: (entityId: TEntityKey[]) => Promise<Map<TEntityKey, TEntity>>;
	/**
	 * Sync provided list of entities with local db, creating, updating
	 * or marking entities as deleted
	 * @param props
	 * @returns An array of entities
	 * @throws {IndexedDBNotInitializedError} If the DB is not ready
	 * @throws {DOMException} If a transaction fails
	 */
	syncAsync: (entity: TEntity | TEntity[]) => Promise<void>;
}
