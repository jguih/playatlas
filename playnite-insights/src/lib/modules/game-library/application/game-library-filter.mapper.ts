import { normalize } from "$lib/modules/common/common";
import type { IGameLibraryFilterMapperPort } from "./game-library-filter.mapper.port";

export class GameLibraryFilterMapper implements IGameLibraryFilterMapperPort {
	toDomain: IGameLibraryFilterMapperPort["toDomain"] = (model) => {
		return {
			Id: model.Id,
			Key: model.Key,
			UseCount: model.UseCount,
			LastUsedAt: model.LastUsedAt,
			Query: {
				Sort: model.Query.Sort,
				Filter: model.Query.Filter ?? null,
			},
			QueryVersion: model.QueryVersion,
			SourceUpdatedAt: model.SourceUpdatedAt,
			SourceUpdatedAtMs: model.SourceUpdatedAtMs,
		};
	};

	toPersistence: IGameLibraryFilterMapperPort["toPersistence"] = (entity) => {
		return {
			Id: entity.Id,
			Key: entity.Key,
			LastUsedAt: entity.LastUsedAt,
			LastUsedAtMs: entity.LastUsedAt.getTime(),
			Query: {
				Sort: entity.Query.Sort,
				Filter: {
					installed: entity.Query.Filter?.installed,
					search: entity.Query.Filter?.search,
					searchNormalized: entity.Query.Filter?.search
						? normalize(entity.Query.Filter?.search)
						: undefined,
				},
			},
			QueryVersion: entity.QueryVersion,
			SourceUpdatedAt: entity.SourceUpdatedAt,
			SourceUpdatedAtMs: entity.SourceUpdatedAtMs,
			UseCount: entity.UseCount,
		};
	};
}
