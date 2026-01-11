export type IClientEntityMapper<TEntity, TDto> = {
	toDomain: (dto: TDto) => TEntity;
};
