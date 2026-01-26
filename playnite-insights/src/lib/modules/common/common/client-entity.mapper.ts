export type IClientEntityMapper<TEntity, TDto> = {
	toDomain: (dto: TDto, lastSync?: Date | null) => TEntity;
};
