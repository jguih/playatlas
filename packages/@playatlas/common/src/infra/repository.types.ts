export type IEntityRepositoryPort<TEntityId, TEntity, TFilters = undefined> = {
	add: (entity: TEntity | TEntity[]) => void;
	update: (entity: TEntity) => void;
	getById: (id: TEntityId) => TEntity | null;
	remove: (id: TEntityId | TEntityId[]) => void;
	all: (filters?: TFilters) => TEntity[];
	exists: (id: TEntityId) => boolean;
	upsert: (entity: TEntity | TEntity[]) => void;
};
