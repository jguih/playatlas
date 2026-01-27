import type { ClientEntity } from "./client-entity";

export type IClientEntityMapper<
	TEntityKey extends IDBValidKey,
	TEntity extends ClientEntity<TEntityKey>,
	TModel,
> = {
	toDomain: (model: TModel) => TEntity;
	toPersistence: (entity: TEntity) => TModel;
};
