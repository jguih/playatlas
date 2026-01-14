import {
	type GameId,
	GameIdParser,
	type GameSessionId,
	GameSessionIdParser,
} from "@playatlas/common/domain";
import type { CloseGameSessionRequestDto } from "./close-session.request.dto";

export type CloseGameSessionCommand = {
	clientUtcNow: Date;
	sessionId: GameSessionId;
	gameId: GameId;
	startTime: Date;
	endTime: Date;
	duration: number;
};

export const makeCloseGameSessionCommand = (
	requestDto: CloseGameSessionRequestDto,
): CloseGameSessionCommand => {
	return {
		clientUtcNow: new Date(requestDto.ClientUtcNow),
		sessionId: GameSessionIdParser.fromExternal(requestDto.SessionId),
		gameId: GameIdParser.fromExternal(requestDto.GameId),
		startTime: new Date(requestDto.StartTime),
		endTime: new Date(requestDto.EndTime),
		duration: requestDto.Duration,
	};
};
