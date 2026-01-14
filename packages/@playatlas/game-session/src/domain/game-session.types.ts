import type { GameId, GameSessionId } from "@playatlas/common/domain";
import type { sessionStatus } from "./game-session.constants";
import type { GameSession } from "./game-session.entity";

export type GameSessionStatusInProgress = (typeof sessionStatus)["inProgress"];
export type GameSessionStatusClosed = (typeof sessionStatus)["closed"];
export type GameSessionStatusStale = (typeof sessionStatus)["stale"];
export type GameSessionStatus =
	| GameSessionStatusClosed
	| GameSessionStatusInProgress
	| GameSessionStatusStale;

export type GameActivity = {
	status: "in_progress" | "not_playing";
	gameName: string | null;
	gameId: GameId | null;
	totalPlaytime: number;
	sessions: GameSession[];
};

export type BuildGameSessionProps = {
	sessionId: GameSessionId;
	startTime: Date;
	status: GameSessionStatus;
	gameId?: GameId | null;
	gameName?: string | null;
	endTime?: Date | null;
	duration?: number | null;
};

export type MakeGameSessionProps = {
	sessionId: GameSessionId;
	startTime: Date;
	gameId: GameId;
	gameName?: string | null;
};

export type MakeClosedGameSessionProps = MakeGameSessionProps & {
	endTime: Date;
	duration: number;
};

export type CloseGameSessionProps = {
	endTime: Date;
	duration: number;
};
