import {
	InvalidStateError,
	type BaseEntity,
	type GameId,
	type GameSessionId,
} from "@playatlas/common/domain";
import { GameSessionNotInProgressError } from "./game-session.errors";
import type {
	BuildGameSessionProps,
	CloseGameSessionProps,
	GameSessionStatus,
	MakeClosedGameSessionProps,
	MakeGameSessionProps,
} from "./game-session.types";

type GameSessionStartTime = Date;
type GameSessionEndTime = Date | null;
type GameSessionGameId = GameId | null;
type GameSessionGameName = string | null;
export type GameSessionDuration = number | null;

export type GameSession = BaseEntity<GameSessionId> &
	Readonly<{
		getSessionId: () => GameSessionId;
		getStartTime: () => GameSessionStartTime;
		getStatus: () => GameSessionStatus;
		getEndTime: () => GameSessionEndTime;
		getGameId: () => GameSessionGameId;
		getGameName: () => GameSessionGameName;
		getDuration: () => GameSessionDuration;
		close(props: CloseGameSessionProps): void;
		stale: () => void;
		isInProgress: () => boolean;
		isClosed: () => boolean;
		isStale: () => boolean;
	}>;

const buildGameSession = (props: BuildGameSessionProps): GameSession => {
	const _sessionId: GameSessionId = props.sessionId;
	const _startTime: GameSessionStartTime = props.startTime;
	let _status: GameSessionStatus = props.status;
	const _gameId: GameSessionGameId = props.gameId ?? null;
	const _gameName: GameSessionGameName = props.gameName ?? null;
	let _endTime: GameSessionEndTime = props.endTime ?? null;
	let _duration: GameSessionDuration = props.duration ?? null;

	const _validate = () => {
		if (_endTime && _startTime && _endTime <= _startTime)
			throw new InvalidStateError(
				"Game session end time must not be equal or earlier than start time",
			);
		if (_duration !== null && _duration !== undefined && _duration <= 0)
			throw new InvalidStateError(
				"Game session duration must be a positive integer greater than 0",
			);
	};

	_validate();

	const newSession: GameSession = {
		getId: () => _sessionId,
		getSafeId: () => _sessionId,
		getSessionId: () => _sessionId,
		getStatus: () => _status,
		getStartTime: () => _startTime,
		getEndTime: () => _endTime,
		getGameId: () => _gameId,
		getGameName: () => _gameName,
		getDuration: () => _duration,
		close: (props) => {
			if (_status !== "in_progress") throw new GameSessionNotInProgressError();
			if (props.endTime <= _startTime)
				throw new InvalidStateError(
					"Game session end time must not be equal or earlier than start time",
				);
			if (props.duration <= 0)
				throw new InvalidStateError(
					"Game session duration must be a positive integer greater than 0",
				);
			_endTime = props.endTime;
			_duration = props.duration;
			_status = "closed";
		},
		stale: () => {
			if (_status !== "in_progress") throw new GameSessionNotInProgressError();
			_status = "stale";
		},
		validate: _validate,
		isClosed: () => _status === "closed",
		isInProgress: () => _status === "in_progress",
		isStale: () => _status === "stale",
	};
	return Object.freeze(newSession);
};

export const makeGameSession = (props: MakeGameSessionProps): GameSession =>
	buildGameSession({
		sessionId: props.sessionId,
		startTime: props.startTime,
		status: "in_progress",
		gameId: props.gameId,
		gameName: props.gameName,
	});

export const makeClosedGameSession = (props: MakeClosedGameSessionProps): GameSession =>
	buildGameSession({
		sessionId: props.sessionId,
		startTime: props.startTime,
		gameId: props.gameId,
		status: "closed",
		duration: props.duration,
		endTime: props.endTime,
		gameName: props.gameName,
	});

export const makeStaleGameSession = (props: MakeGameSessionProps): GameSession =>
	buildGameSession({
		sessionId: props.sessionId,
		startTime: props.startTime,
		gameId: props.gameId,
		status: "stale",
		gameName: props.gameName,
	});

export const rehydrateGameSession = (props: BuildGameSessionProps): GameSession =>
	buildGameSession(props);
