import {
	GameSessionIdParser,
	PlayniteGameIdParser,
	type GameSessionId,
	type PlayniteGameId,
} from "@playatlas/common/domain";
import type { StaleGameSessionRequestDto } from "./stale-session.request.dto";

export type StaleGameSessionCommand = {
	clientUtcNow: Date;
	sessionId: GameSessionId;
	gameId: PlayniteGameId;
	startTime: Date;
	endTime?: Date | null;
	duration?: number | null;
};

export const makeStaleGameSessionCommand = (
	requestDto: StaleGameSessionRequestDto,
): StaleGameSessionCommand => {
	return {
		clientUtcNow: new Date(requestDto.ClientUtcNow),
		sessionId: GameSessionIdParser.fromExternal(requestDto.SessionId),
		gameId: PlayniteGameIdParser.fromExternal(requestDto.GameId),
		startTime: new Date(requestDto.StartTime),
		endTime: requestDto.EndTime ? new Date(requestDto.EndTime) : null,
		duration: requestDto.Duration,
	};
};
