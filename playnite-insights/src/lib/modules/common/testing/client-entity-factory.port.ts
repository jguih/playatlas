export interface IClientEntityFactoryPort<TEntity> {
	build: () => TEntity;
	buildList: (n: number) => TEntity[];
}
