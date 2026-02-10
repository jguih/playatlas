import type { EntityMapper } from "@playatlas/common/application";
import { GameIdParser, GameSessionIdParser } from "@playatlas/common/domain";
import { type GameSession } from "../domain/game-session.entity";
import type { GameSessionModel } from "../infra/game-session.repository";
import type { IGameSessionFactoryPort } from "./game-session.factory";

export type IGameSessionMapperPort = EntityMapper<GameSession, GameSessionModel>;

export type GameSessionMapperDeps = {
	gameSessionFactory: IGameSessionFactoryPort;
};

export const makeGameSessionMapper = ({
	gameSessionFactory,
}: GameSessionMapperDeps): IGameSessionMapperPort => {
	return {
		toDomain: (model) => {
			return gameSessionFactory.rehydrate({
				sessionId: GameSessionIdParser.fromTrusted(model.SessionId),
				startTime: new Date(model.StartTime),
				status: model.Status,
				duration: model.Duration,
				endTime: model.EndTime ? new Date(model.EndTime) : null,
				gameId: GameIdParser.fromTrusted(model.GameId),
				gameName: model.GameName,
				createdAt: new Date(model.CreatedAt),
				lastUpdatedAt: new Date(model.LastUpdatedAt),
				deletedAt: model.DeletedAt ? new Date(model.DeletedAt) : null,
				deleteAfter: model.DeleteAfter ? new Date(model.DeleteAfter) : null,
			});
		},
		toPersistence: (entity) => {
			const record: GameSessionModel = {
				SessionId: entity.getSessionId(),
				GameId: entity.getGameId(),
				GameName: entity.getGameName(),
				StartTime: entity.getStartTime().toISOString(),
				EndTime: entity.getEndTime()?.toISOString() ?? null,
				Duration: entity.getDuration(),
				Status: entity.getStatus(),
				LastUpdatedAt: entity.getLastUpdatedAt().toISOString(),
				CreatedAt: entity.getCreatedAt().toISOString(),
				DeletedAt: entity.getDeletedAt()?.toISOString() ?? null,
				DeleteAfter: entity.getDeleteAfter()?.toISOString() ?? null,
			};
			return record;
		},
	};
};
