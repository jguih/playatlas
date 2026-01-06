import type { OpenGameSessionRequestDto } from "./open-session.request.dto";

export type OpenGameSessionCommand = {
  clientUtcNow: string;
  sessionId: string;
  gameId: string;
};

export const makeOpenGameSessionCommand = (
  requestDto: OpenGameSessionRequestDto
): OpenGameSessionCommand => {
  return {
    clientUtcNow: requestDto.ClientUtcNow,
    sessionId: requestDto.SessionId,
    gameId: requestDto.GameId,
  };
};
