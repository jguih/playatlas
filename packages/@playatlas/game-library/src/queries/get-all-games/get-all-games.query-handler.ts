import type { IQueryHandlerPort } from "@playatlas/common/application";
import { computeNextSyncCursor } from "@playatlas/common/common";
import type { GameFilters } from "../../infra/game.repository.types";
import type { GetAllGamesQuery } from "./get-all-games.query";
import type {
	GetAllGamesQueryHandlerDeps,
	GetAllGamesQueryResult,
} from "./get-all-games.query.types";

export type IGetAllGamesQueryHandlerPort = IQueryHandlerPort<
	GetAllGamesQuery,
	GetAllGamesQueryResult
>;

export const makeGetAllGamesQueryHandler = ({
	gameRepository,
	gameMapper,
	logService,
	clock,
}: GetAllGamesQueryHandlerDeps): IGetAllGamesQueryHandlerPort => {
	return {
		execute: ({ lastCursor } = {}) => {
			const filters: GameFilters | undefined = lastCursor
				? {
						syncCursor: lastCursor,
					}
				: undefined;

			const games = gameRepository.all({ load: true }, filters);

			if (lastCursor) {
				const elapsedMs = clock.now().getTime() - lastCursor.lastUpdatedAt.getTime();
				const elapsedSeconds = Math.floor(elapsedMs / 1000);
				logService.debug(
					`Found ${games.length} games (updated since last sync: ${elapsedSeconds}s ago)`,
				);
			} else {
				logService.debug(`Found ${games.length} games (no filters)`);
			}

			const gameDtos = gameMapper.toDtoList(games);
			const nextCursor = computeNextSyncCursor(games, lastCursor);
			return { data: gameDtos, nextCursor };
		},
	};
};
