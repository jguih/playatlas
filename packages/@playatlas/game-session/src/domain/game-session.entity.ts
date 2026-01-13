import type {
  BaseEntity,
  GameId,
  GameSessionId,
} from "@playatlas/common/domain";
import {
  EndTimeBeforeStartTimeError,
  GameSessionNotInProgressError,
  InvalidGameSessionDurationError,
} from "./game-session.errors";
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
  }>;

const buildGameSession = (props: BuildGameSessionProps): GameSession => {
  const _sessionId: GameSessionId = props.sessionId;
  const _startTime: GameSessionStartTime = props.startTime;
  let _status: GameSessionStatus = props.status;
  const _gameId: GameSessionGameId = props.gameId ?? null;
  const _gameName: GameSessionGameName = props.gameName ?? null;
  let _endTime: GameSessionEndTime = props.endTime ?? null;
  let _duration: GameSessionDuration = props.duration ?? null;

  const newSession: GameSession = Object.freeze({
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
      if (props.endTime <= _startTime) throw new EndTimeBeforeStartTimeError();
      if (props.duration < 0)
        throw new InvalidGameSessionDurationError({
          sessionDuration: props.duration,
        });
      _endTime = props.endTime;
      _duration = props.duration;
      _status = "closed";
    },
    stale: () => {
      if (_status !== "in_progress") throw new GameSessionNotInProgressError();
      _status = "stale";
    },
    validate: () => {},
  });
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

export const makeClosedGameSession = (
  props: MakeClosedGameSessionProps
): GameSession =>
  buildGameSession({
    sessionId: props.sessionId,
    startTime: props.startTime,
    gameId: props.gameId,
    status: "closed",
    duration: props.duration,
    endTime: props.endTime,
    gameName: props.gameName,
  });

export const makeStaleGameSession = (
  props: MakeGameSessionProps
): GameSession =>
  buildGameSession({
    sessionId: props.sessionId,
    startTime: props.startTime,
    gameId: props.gameId,
    status: "stale",
    gameName: props.gameName,
  });
