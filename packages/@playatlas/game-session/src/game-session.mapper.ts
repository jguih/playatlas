import { GameIdParser, GameSessionIdParser } from "@playatlas/common/domain";
import { rehydrateGameSession, type GameSession } from "./domain/game-session.entity";
import type { GameSessionModel } from "./infra/game-session.repository";

export const gameSessionMapper = {
	toPersistence: (session: GameSession): GameSessionModel => {
		const record: GameSessionModel = {
			SessionId: session.getSessionId(),
			GameId: session.getGameId(),
			GameName: session.getGameName(),
			StartTime: session.getStartTime().toISOString(),
			EndTime: session.getEndTime()?.toISOString() ?? null,
			Duration: session.getDuration(),
			Status: session.getStatus(),
		};
		return record;
	},
	toDomain: (session: GameSessionModel): GameSession => {
		return rehydrateGameSession({
			sessionId: GameSessionIdParser.fromTrusted(session.SessionId),
			startTime: new Date(session.StartTime),
			status: session.Status,
			duration: session.Duration,
			endTime: session.EndTime ? new Date(session.EndTime) : null,
			gameId: session.GameId ? GameIdParser.fromTrusted(session.GameId) : null,
			gameName: session.GameName,
		});
	},
};
