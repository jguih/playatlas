import { normalize } from "$lib/modules/common/common";
import { GameLibraryFilterAggregate } from "../domain/game-library-filter";
import type { IGameLibraryFilterMapperPort } from "./game-library-filter.mapper.port";

export class GameLibraryFilterMapper implements IGameLibraryFilterMapperPort {
	toDomain: IGameLibraryFilterMapperPort["toDomain"] = (model) => {
		return new GameLibraryFilterAggregate({
			id: model.Id,
			key: model.Key,
			lastUsedAt: model.LastUsedAt,
			query: {
				filter: model.Query.filter,
				sort: model.Query.sort,
			},
			queryVersion: model.QueryVersion,
			sourceLastUpdatedAt: model.SourceLastUpdatedAt,
			useCount: model.UseCount,
		});
	};

	toPersistence: IGameLibraryFilterMapperPort["toPersistence"] = (entity) => {
		return {
			Id: entity.Id,
			Key: entity.Key,
			LastUsedAt: entity.LastUsedAt,
			LastUsedAtMs: entity.LastUsedAt.getTime(),
			Query: {
				sort: entity.Query.sort,
				filter: {
					installed: entity.Query.filter?.installed,
					search: entity.Query.filter?.search,
					searchNormalized: entity.Query.filter?.search
						? normalize(entity.Query.filter?.search)
						: undefined,
				},
			},
			QueryVersion: entity.QueryVersion,
			SourceLastUpdatedAt: entity.SourceLastUpdatedAt,
			SourceLastUpdatedAtMs: entity.SourceLastUpdatedAt.getTime(),
			UseCount: entity.UseCount,
		};
	};
}
