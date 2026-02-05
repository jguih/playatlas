import type { IQueryHandlerPort } from "@playatlas/common/application";
import { computeNextSyncCursor } from "@playatlas/common/common";
import type { GenreRepositoryFilters } from "../../infra/genre.repository.types";
import type { GetAllGenresQuery } from "./get-all-genres.query";
import type {
	GetAllGenresQueryHandlerDeps,
	GetAllGenresQueryResult,
} from "./get-all-genres.query.types";

export type IGetAllGenresQueryHandlerPort = IQueryHandlerPort<
	GetAllGenresQuery,
	GetAllGenresQueryResult
>;

export const makeGetAllGenresQueryHandler = ({
	genreRepository,
	genreMapper,
	logService,
	clock,
}: GetAllGenresQueryHandlerDeps): IGetAllGenresQueryHandlerPort => {
	return {
		execute: ({ lastCursor } = {}) => {
			const filters: GenreRepositoryFilters | undefined = lastCursor
				? {
						syncCursor: lastCursor,
					}
				: undefined;

			const genres = genreRepository.all(filters);

			if (lastCursor) {
				const elapsedMs = clock.now().getTime() - lastCursor.lastUpdatedAt.getTime();
				const elapsedSeconds = Math.floor(elapsedMs / 1000);
				logService.debug(
					`Found ${genres.length} genres (updated since last sync: ${elapsedSeconds}s ago)`,
				);
			} else {
				logService.debug(`Found ${genres.length} genres (no filters)`);
			}

			const genreDtos = genreMapper.toDtoList(genres);
			const nextCursor = computeNextSyncCursor(genres, lastCursor);

			return { data: genreDtos, nextCursor };
		},
	};
};
