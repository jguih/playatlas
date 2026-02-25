import {
	GameSessionIdParser,
	PlayniteGameIdParser,
	type GameSessionId,
	type PlayniteGameId,
} from "@playatlas/common/domain";
import type { OpenGameSessionRequestDto } from "./open-session.request.dto";

export type OpenGameSessionCommand = {
	clientUtcNow: string;
	sessionId: GameSessionId;
	gameId: PlayniteGameId;
};

export const makeOpenGameSessionCommand = (
	requestDto: OpenGameSessionRequestDto,
): OpenGameSessionCommand => {
	return {
		clientUtcNow: requestDto.ClientUtcNow,
		sessionId: GameSessionIdParser.fromExternal(requestDto.SessionId),
		gameId: PlayniteGameIdParser.fromExternal(requestDto.GameId),
	};
};
