export type EntityMapper<TEntity, TModel, TDto = undefined> = {
	toPersistence: (entity: TEntity) => TModel;
	toDomain: (model: TModel) => TEntity;
} & (TDto extends undefined
	? object
	: {
			toDto: (entity: TEntity) => TDto;
			toDtoList: (entity: TEntity[]) => TDto[];
		});
