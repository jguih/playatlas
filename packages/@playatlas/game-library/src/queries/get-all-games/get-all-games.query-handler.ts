import type { QueryHandler } from "@playatlas/common/common";
import { createHashForObject } from "@playatlas/common/infra";
import { gameMapper } from "../../game.mapper";
import type { GetAllGamesQuery } from "./get-all-games.query";
import type {
	GetAllGamesQueryHandlerDeps,
	GetAllGamesQueryResult,
} from "./get-all-games.query.types";

export type IGetAllGamesQueryHandlerPort = QueryHandler<GetAllGamesQuery, GetAllGamesQueryResult>;

export const makeGetAllGamesQueryHandler = ({
	gameRepository,
}: GetAllGamesQueryHandlerDeps): IGetAllGamesQueryHandlerPort => {
	return {
		execute: ({ ifNoneMatch, since } = {}) => {
			const games = gameRepository.all({ load: true }, { modifiedSince: since ?? undefined });

			if (!games || games.length === 0) {
				return { type: "ok", data: [], etag: '"empty"' };
			}

			const gameDtos = gameMapper.toDtoList(games);
			const hash = createHashForObject(gameDtos);
			const etag = `"${hash}"`;

			if (ifNoneMatch === etag) {
				return { type: "not_modified" };
			}

			return { type: "ok", data: gameDtos, etag };
		},
	};
};
