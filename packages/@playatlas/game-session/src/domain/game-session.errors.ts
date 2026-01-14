import { type GameSessionId } from "@playatlas/common/domain";
import { sessionStatus } from "./game-session.constants";
import { type GameSessionDuration } from "./game-session.entity";

export class GameSessionError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "GameSessionError";
	}
}

export class GameSessionNotInProgressError extends GameSessionError {
	constructor() {
		super("Cannot close a session that is not in progress");
	}
}

export class EndTimeBeforeStartTimeError extends GameSessionError {
	constructor() {
		super("End time cannot be earlier than start time");
	}
}

export class InvalidClosedGameSessionError extends GameSessionError {
	constructor(props: { sessionId: GameSessionId }) {
		super(`Invalid session ${props.sessionId}: closed session must have end time and duration`);
	}
}

export class InvalidInProgressGameSessionError extends GameSessionError {
	constructor(props: { sessionId: GameSessionId }) {
		super(
			`Invalid session ${props.sessionId}: in progress session must not have end time and duration`,
		);
	}
}

export class InvalidGameSessionStatusError extends GameSessionError {
	constructor(props: { sessionStatus: unknown }) {
		super(
			`Invalid game session status: ${
				props.sessionStatus
			}. Valid statuses are: ${Object.values(sessionStatus).join(", ")}`,
		);
	}
}

export class InvalidGameSessionDurationError extends GameSessionError {
	constructor(props: { sessionDuration: GameSessionDuration }) {
		super(
			`Invalid game session duration: ${props.sessionDuration}. Duration must be a positive integer grater than 0.`,
		);
	}
}
