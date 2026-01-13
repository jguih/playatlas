import { faker } from "@faker-js/faker";
import { GameIdParser, GameSessionIdParser } from "@playatlas/common/domain";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  makeCloseGameSessionCommand,
  type CloseGameSessionCommand,
} from "../../src/commands/close-session/close-session.command";
import {
  closeGameSessionRequestDtoSchema,
  type CloseGameSessionRequestDto,
} from "../../src/commands/close-session/close-session.request.dto";
import {
  makeCloseGameSessionCommandHandler,
  type CloseGameSessionServiceDeps,
} from "../../src/commands/close-session/close-session.service";
import {
  makeClosedGameSession,
  makeGameSession,
  type GameSession,
} from "../../src/domain/game-session.entity";
import {
  GameSessionNotInProgressError,
  InvalidGameSessionDurationError,
} from "../../src/domain/game-session.errors";

let deps = {
  logService: {
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    success: vi.fn(),
    debug: vi.fn(),
    getRequestDescription: vi.fn(),
  },
  gameSessionRepository: {
    getById: vi.fn(),
    add: vi.fn(),
    update: vi.fn(),
    all: vi.fn(),
    getAllBy: vi.fn(),
  },
  gameInfoProvider: {
    getGameInfo: (gameId) => {
      return { name: faker.lorem.words({ min: 1, max: 3 }) };
    },
  },
} satisfies CloseGameSessionServiceDeps;

const service = makeCloseGameSessionCommandHandler({ ...deps });

const factory = {
  makeInProgressSession: (): GameSession =>
    makeGameSession({
      sessionId: GameSessionIdParser.fromExternal(faker.string.uuid()),
      startTime: faker.date.recent(),
      gameId: GameIdParser.fromExternal(faker.string.uuid()),
      gameName: faker.lorem.words(3),
    }),
  makeClosedSession: (now: Date): GameSession =>
    makeClosedGameSession({
      sessionId: GameSessionIdParser.fromExternal(faker.string.uuid()),
      startTime: faker.date.recent(),
      gameId: GameIdParser.fromExternal(faker.string.uuid()),
      gameName: faker.lorem.words(3),
      duration: faker.number.int({ min: 0, max: 3200 }),
      endTime: now,
    }),
};

describe("Close Game Session Service", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("create new closed session", () => {
    // Arrange
    const now = new Date();
    const gameId = faker.string.uuid();
    const requestDto: CloseGameSessionRequestDto = {
      ClientUtcNow: now.toISOString(),
      SessionId: faker.string.uuid(),
      GameId: gameId,
      StartTime: faker.date.recent().toISOString(),
      EndTime: now.toISOString(),
      Duration: 1200,
    };
    const command: CloseGameSessionCommand =
      makeCloseGameSessionCommand(requestDto);
    deps.gameSessionRepository.getById.mockReturnValueOnce(undefined);
    deps.gameSessionRepository.add.mockReturnValueOnce(true);
    // Act
    const result = service.execute(command);
    // Assert
    expect(() =>
      closeGameSessionRequestDtoSchema.parse(requestDto)
    ).not.toThrow();
    expect(deps.gameSessionRepository.add).toHaveBeenCalledOnce();
    expect(result.created).toBeTruthy();
  });

  it("close existing in progress session", () => {
    // Arrange
    const now = new Date();
    const inProgressSession = factory.makeInProgressSession();
    const requestDto: CloseGameSessionRequestDto = {
      ClientUtcNow: now.toISOString(),
      SessionId: inProgressSession.getSessionId(),
      GameId: inProgressSession.getGameId()!,
      StartTime: inProgressSession.getStartTime().toISOString(),
      EndTime: now.toISOString(),
      Duration: 1200,
    };
    const command: CloseGameSessionCommand =
      makeCloseGameSessionCommand(requestDto);
    deps.gameSessionRepository.getById.mockReturnValueOnce(inProgressSession);
    deps.gameSessionRepository.update.mockReturnValueOnce(true);
    // Act
    const result = service.execute(command);
    // Assert
    expect(() =>
      closeGameSessionRequestDtoSchema.parse(requestDto)
    ).not.toThrow();
    expect(deps.gameSessionRepository.update).toHaveBeenCalledOnce();
    expect(result.created).toBeFalsy();
    expect(result.closed).toBeTruthy();
  });

  it.each([{ duration: -30 }, { duration: -4000 }, { duration: -1 }])(
    "throws when closing a session with an invalid duration",
    ({ duration }) => {
      // Arrange
      const now = new Date();
      const inProgress = factory.makeInProgressSession();
      const requestDto: CloseGameSessionRequestDto = {
        ClientUtcNow: now.toISOString(),
        SessionId: inProgress.getSessionId(),
        GameId: inProgress.getGameId()!,
        StartTime: inProgress.getStartTime().toISOString(),
        EndTime: now.toISOString(),
        Duration: duration,
      };
      const command: CloseGameSessionCommand =
        makeCloseGameSessionCommand(requestDto);
      deps.gameSessionRepository.getById.mockReturnValueOnce(inProgress);
      // Act & Assert
      expect(() =>
        closeGameSessionRequestDtoSchema.parse(requestDto)
      ).not.toThrow();
      expect(() => service.execute(command)).toThrowError(
        InvalidGameSessionDurationError
      );
      expect(deps.gameSessionRepository.update).not.toHaveBeenCalled();
    }
  );

  it("throws when attempting to close an already closed session", () => {
    // Arrange
    const now = new Date();
    const closed = factory.makeClosedSession(now);
    const requestDto: CloseGameSessionRequestDto = {
      ClientUtcNow: now.toISOString(),
      SessionId: closed.getSessionId(),
      GameId: closed.getGameId()!,
      StartTime: closed.getStartTime().toISOString(),
      EndTime: closed.getEndTime()!.toISOString(),
      Duration: closed.getDuration()!,
    };
    const command = makeCloseGameSessionCommand(requestDto);
    deps.gameSessionRepository.getById.mockReturnValueOnce(closed);
    // Act & Assert
    expect(() =>
      closeGameSessionRequestDtoSchema.parse(requestDto)
    ).not.toThrow();
    expect(() => service.execute(command)).toThrowError(
      GameSessionNotInProgressError
    );
    expect(deps.gameSessionRepository.update).not.toHaveBeenCalled();
  });
});
