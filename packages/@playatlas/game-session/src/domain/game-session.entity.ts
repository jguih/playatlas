import {
	InvalidStateError,
	makeSoftDeletable,
	type BaseEntity,
	type EntitySoftDeleteProps,
	type GameId,
	type GameSessionId,
	type GameSessionStatus,
} from "@playatlas/common/domain";
import { GameSessionNotInProgressError } from "./game-session.errors";
import type {
	BuildGameSessionProps,
	CloseGameSessionProps,
	MakeClosedGameSessionProps,
	MakeGameSessionDeps,
	MakeGameSessionProps,
	RehydrateGameSessionProps,
} from "./game-session.types";

type GameSessionStartTime = Date;
type GameSessionEndTime = Date | null;
type GameSessionGameId = GameId;
type GameSessionGameName = string | null;
export type GameSessionDuration = number | null;

export type GameSession = BaseEntity<GameSessionId> &
	EntitySoftDeleteProps &
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

const buildGameSession = (
	props: BuildGameSessionProps,
	{ clock }: MakeGameSessionDeps,
): GameSession => {
	const now = clock.now();

	const _sessionId: GameSessionId = props.sessionId;
	const _startTime: GameSessionStartTime = props.startTime;
	let _status: GameSessionStatus = props.status;
	const _gameId: GameSessionGameId = props.gameId;
	const _gameName: GameSessionGameName = props.gameName ?? null;
	let _endTime: GameSessionEndTime = props.endTime ?? null;
	let _duration: GameSessionDuration = props.duration ?? null;
	let _last_updated_at = props.lastUpdatedAt ?? now;
	const _created_at = props.createdAt ?? now;

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

	const _touch = () => {
		_last_updated_at = clock.now();
	};

	const softDelete = makeSoftDeletable(
		{ deletedAt: props.deletedAt, deleteAfter: props.deleteAfter },
		{ clock, touch: _touch, validate: _validate },
	);

	const newSession: GameSession = {
		getId: () => _sessionId,
		getSafeId: () => _sessionId,
		getSessionId: () => _sessionId,
		getLastUpdatedAt: () => _last_updated_at,
		getCreatedAt: () => _created_at,
		getStatus: () => _status,
		getStartTime: () => _startTime,
		getEndTime: () => _endTime,
		getGameId: () => _gameId,
		getGameName: () => _gameName,
		getDuration: () => _duration,
		close: (props) => {
			if (_status !== "in_progress") throw new GameSessionNotInProgressError();
			if (props.endTime.getTime() <= _startTime.getTime())
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
		...softDelete,
		validate: _validate,
		isClosed: () => _status === "closed",
		isInProgress: () => _status === "in_progress",
		isStale: () => _status === "stale",
	};
	return Object.freeze(newSession);
};

export const makeGameSession = (
	props: MakeGameSessionProps,
	deps: MakeGameSessionDeps,
): GameSession =>
	buildGameSession(
		{
			sessionId: props.sessionId,
			startTime: props.startTime,
			gameId: props.gameId,
			status: "in_progress",
			gameName: props.gameName,
		},
		deps,
	);

export const makeClosedGameSession = (
	props: MakeClosedGameSessionProps,
	deps: MakeGameSessionDeps,
): GameSession =>
	buildGameSession(
		{
			sessionId: props.sessionId,
			startTime: props.startTime,
			gameId: props.gameId,
			status: "closed",
			gameName: props.gameName,
			duration: props.duration,
			endTime: props.endTime,
		},
		deps,
	);

export const makeStaleGameSession = (
	props: MakeGameSessionProps,
	deps: MakeGameSessionDeps,
): GameSession =>
	buildGameSession(
		{
			sessionId: props.sessionId,
			startTime: props.startTime,
			gameId: props.gameId,
			status: "stale",
			gameName: props.gameName,
		},
		deps,
	);

export const rehydrateGameSession = (
	props: RehydrateGameSessionProps,
	deps: MakeGameSessionDeps,
): GameSession => buildGameSession(props, deps);
