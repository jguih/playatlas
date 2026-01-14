import {
	GameIdParser,
	GameSessionIdParser,
	type GameId,
	type GameSessionId,
} from "@playatlas/common/domain";
import type { OpenGameSessionRequestDto } from "./open-session.request.dto";

export type OpenGameSessionCommand = {
	clientUtcNow: string;
	sessionId: GameSessionId;
	gameId: GameId;
};

export const makeOpenGameSessionCommand = (
	requestDto: OpenGameSessionRequestDto,
): OpenGameSessionCommand => {
	return {
		clientUtcNow: requestDto.ClientUtcNow,
		sessionId: GameSessionIdParser.fromExternal(requestDto.SessionId),
		gameId: GameIdParser.fromExternal(requestDto.GameId),
	};
};
