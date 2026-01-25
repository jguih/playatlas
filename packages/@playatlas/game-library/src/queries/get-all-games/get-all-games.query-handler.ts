import type { QueryHandler } from "@playatlas/common/common";
import { createHashForObject } from "@playatlas/common/infra";
import type { PlayniteProjectionResponseDto } from "../../dtos";
import type { GameFilters } from "../../infra/game.repository.types";
import type { GetAllGamesQuery } from "./get-all-games.query";
import type {
	GetAllGamesQueryHandlerDeps,
	GetAllGamesQueryResult,
} from "./get-all-games.query.types";

export type IGetAllGamesQueryHandlerPort = QueryHandler<GetAllGamesQuery, GetAllGamesQueryResult>;

export const makeGetAllGamesQueryHandler = ({
	gameRepository,
	gameMapper,
	logService,
	clock,
}: GetAllGamesQueryHandlerDeps): IGetAllGamesQueryHandlerPort => {
	const computeNextCursor = (
		gameDtos: PlayniteProjectionResponseDto[],
		since?: Date | null,
	): Date => {
		const baseCursor = since ?? new Date(0);

		if (gameDtos.length === 0) {
			return baseCursor;
		}

		return gameDtos.reduce<Date>((latest, game) => {
			const updatedAt = new Date(game.Sync.LastUpdatedAt);
			return updatedAt > latest ? updatedAt : latest;
		}, baseCursor);
	};

	return {
		execute: ({ ifNoneMatch, since } = {}) => {
			const filters: GameFilters | undefined = since
				? {
						lastUpdatedAt: [{ op: "gte", value: since }],
					}
				: undefined;

			const games = gameRepository.all({ load: true }, filters);

			if (since) {
				const elapsedMs = clock.now().getTime() - since.getTime();
				const elapsedSeconds = Math.floor(elapsedMs / 1000);
				logService.debug(
					`Found ${games.length} games (updated since last sync: ${elapsedSeconds}s ago)`,
				);
			} else {
				logService.debug(`Found ${games.length} games (no filters)`);
			}

			const gameDtos = gameMapper.toDtoList(games);
			const nextCursor = computeNextCursor(gameDtos, since).toISOString();
			const hash = createHashForObject(gameDtos);
			const etag = `"${hash}"`;

			if (ifNoneMatch === etag) {
				return { type: "not_modified", nextCursor };
			}

			return { type: "ok", data: gameDtos, etag, nextCursor };
		},
	};
};
