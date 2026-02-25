import {
	type GameSessionId,
	GameSessionIdParser,
	type PlayniteGameId,
	PlayniteGameIdParser,
} from "@playatlas/common/domain";
import type { CloseGameSessionRequestDto } from "./close-session.request.dto";

export type CloseGameSessionCommand = {
	clientUtcNow: Date;
	sessionId: GameSessionId;
	gameId: PlayniteGameId;
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
		gameId: PlayniteGameIdParser.fromExternal(requestDto.GameId),
		startTime: new Date(requestDto.StartTime),
		endTime: new Date(requestDto.EndTime),
		duration: requestDto.Duration,
	};
};
