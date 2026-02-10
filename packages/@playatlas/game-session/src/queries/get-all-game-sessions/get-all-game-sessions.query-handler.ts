import type { IQueryHandlerPort } from "@playatlas/common/application";
import { computeNextSyncCursor } from "@playatlas/common/infra";
import type { GameSessionRepositoryFilters } from "../../infra/game-session.repository.filters";
import type { GetAllGameSessionsQuery } from "./get-all-game-sessions.query";
import type {
	GetAllGameSessionsQueryHandlerDeps,
	GetAllGameSessionsQueryResult,
} from "./get-all-game-sessions.query.types";

export type IGetAllGameSessionsQueryHandlerPort = IQueryHandlerPort<
	GetAllGameSessionsQuery,
	GetAllGameSessionsQueryResult
>;

export const makeGetAllGameSessionsQueryHandler = ({
	gameSessionRepository,
	gameSessionMapper,
	clock,
	logService,
}: GetAllGameSessionsQueryHandlerDeps): IGetAllGameSessionsQueryHandlerPort => {
	return {
		execute: ({ lastCursor } = {}) => {
			const filters: GameSessionRepositoryFilters | undefined = lastCursor
				? {
						syncCursor: lastCursor,
					}
				: undefined;

			const gameSessions = gameSessionRepository.all(filters);

			if (lastCursor) {
				const elapsedMs = clock.now().getTime() - lastCursor.lastUpdatedAt.getTime();
				const elapsedSeconds = Math.floor(elapsedMs / 1000);
				logService.debug(
					`Found ${gameSessions.length} game sessions (updated since last sync: ${elapsedSeconds}s ago)`,
				);
			} else {
				logService.debug(`Found ${gameSessions.length} game sessions (no filters)`);
			}

			const gameSessionDtos = gameSessionMapper.toDtoList(gameSessions);
			const nextCursor = computeNextSyncCursor(gameSessions, lastCursor);

			return { data: gameSessionDtos, nextCursor };
		},
	};
};
