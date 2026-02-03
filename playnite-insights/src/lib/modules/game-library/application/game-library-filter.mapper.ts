import type { IGameLibraryFilterMapperPort } from "./game-library-filter.mapper.port";

export class GameLibraryFilterMapper implements IGameLibraryFilterMapperPort {
	toDomain: IGameLibraryFilterMapperPort["toDomain"] = (model) => {
		return {
			Id: model.Id,
			Hash: model.Hash,
			UseCount: model.UseCount,
			LastUsedAt: model.LastUsedAt,
			Query: model.Query,
			QueryVersion: model.QueryVersion,
			SourceUpdatedAt: model.SourceUpdatedAt,
			SourceUpdatedAtMs: model.SourceUpdatedAtMs,
		};
	};

	toPersistence: IGameLibraryFilterMapperPort["toPersistence"] = (entity) => {
		return {
			Id: entity.Id,
			Hash: entity.Hash,
			LastUsedAt: entity.LastUsedAt,
			LastUsedAtMs: entity.LastUsedAt.getTime(),
			Query: entity.Query,
			QueryVersion: entity.QueryVersion,
			SourceUpdatedAt: entity.SourceUpdatedAt,
			SourceUpdatedAtMs: entity.SourceUpdatedAtMs,
			UseCount: entity.UseCount,
		};
	};
}
