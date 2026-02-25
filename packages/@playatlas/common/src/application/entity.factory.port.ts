export type IEntityFactoryPort<TCreateEntityProps, TRehydrateEntityProps, TEntity> = {
	create: (props: TCreateEntityProps) => TEntity;
	rehydrate: (props: TRehydrateEntityProps) => TEntity;
};
