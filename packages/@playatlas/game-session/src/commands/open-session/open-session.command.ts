import { GameId, GameIdParser } from "@playatlas/common/domain";
import type { OpenGameSessionRequestDto } from "./open-session.request.dto";

export type OpenGameSessionCommand = {
  clientUtcNow: string;
  sessionId: string;
  gameId: GameId;
};

export const makeOpenGameSessionCommand = (
  requestDto: OpenGameSessionRequestDto
): OpenGameSessionCommand => {
  return {
    clientUtcNow: requestDto.ClientUtcNow,
    sessionId: requestDto.SessionId,
    gameId: GameIdParser.fromExternal(requestDto.GameId),
  };
};
