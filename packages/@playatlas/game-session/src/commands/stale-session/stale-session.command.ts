import type { StaleGameSessionRequestDto } from "./stale-session.request.dto";

export type StaleGameSessionCommand = {
	clientUtcNow: Date;
	sessionId: string;
	gameId: string;
	startTime: Date;
	endTime?: Date | null;
	duration?: number | null;
};

export const makeStaleGameSessionCommand = (
	requestDto: StaleGameSessionRequestDto,
): StaleGameSessionCommand => {
	return {
		clientUtcNow: new Date(requestDto.ClientUtcNow),
		sessionId: requestDto.SessionId,
		gameId: requestDto.GameId,
		startTime: new Date(requestDto.StartTime),
		endTime: requestDto.EndTime ? new Date(requestDto.EndTime) : null,
		duration: requestDto.Duration,
	};
};
