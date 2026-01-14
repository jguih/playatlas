import { faker } from "@faker-js/faker";
import type { DomainEvent } from "@playatlas/common/application";
import { GameSessionIdParser } from "@playatlas/common/domain";
import type { Game } from "@playatlas/game-library/domain";
import {
	makeCloseGameSessionCommand,
	makeOpenGameSessionCommand,
	type CloseGameSessionRequestDto,
	type OpenGameSessionRequestDto,
} from "@playatlas/game-session/commands";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { api, factory, root } from "../vitest.global.setup";

const recordDomainEvents = () => {
	const events: DomainEvent[] = [];
	const unsubscribe = api.getEventBus().subscribe((event) => events.push(event));
	return { events, unsubscribe };
};

describe("Game Sessions", () => {
	let game: Game;
	let unsubscribe: () => void;
	let events: DomainEvent[];

	beforeEach(() => {
		game = factory.getGameFactory().build();
		root.seedGame(game);
		({ events, unsubscribe } = recordDomainEvents());
	});

	afterEach(() => {
		unsubscribe();
	});

	it("opens a game session", () => {
		// Arrange
		const now = new Date().toISOString();
		const gameId = game.getId();
		const sessionId = faker.string.uuid();

		const requestDto: OpenGameSessionRequestDto = {
			ClientUtcNow: now,
			GameId: gameId,
			SessionId: sessionId,
		};

		const command = makeOpenGameSessionCommand(requestDto);

		// Act
		const result = api.gameSession.commands.getOpenGameSessionCommandHandler().execute(command);

		// Assert
		expect(result.success).toBe(true);
		expect(result.reason_code).toBe("opened_game_session_created");

		expect(events).toHaveLength(1);
		expect(events).toEqual([
			expect.objectContaining({
				name: "opened-game-session",
				payload: {
					gameId,
					sessionId: GameSessionIdParser.fromExternal(sessionId),
				},
			} satisfies Partial<DomainEvent>),
		]);
	});

	it("fails when game doesn't exist", () => {
		// Arrange
		const now = new Date().toISOString();
		const gameId = faker.string.uuid();
		const sessionId = faker.string.uuid();

		const requestDto: OpenGameSessionRequestDto = {
			ClientUtcNow: now,
			GameId: gameId,
			SessionId: sessionId,
		};

		const command = makeOpenGameSessionCommand(requestDto);

		// Act
		const result = api.gameSession.commands.getOpenGameSessionCommandHandler().execute(command);

		// Assert
		expect(result.success).toBe(false);
		expect(result.reason_code).toBe("game_not_found");

		expect(events).toHaveLength(0);
	});

	it("closes an in progress game session", () => {
		// Arrange
		const now = new Date().toISOString();
		const gameId = game.getId();
		const sessionId = faker.string.uuid();

		const openRequestDto: OpenGameSessionRequestDto = {
			ClientUtcNow: now,
			GameId: gameId,
			SessionId: sessionId,
		};
		const openCommand = makeOpenGameSessionCommand(openRequestDto);

		const closeRequestDto: CloseGameSessionRequestDto = {
			ClientUtcNow: now,
			GameId: gameId,
			SessionId: sessionId,
			Duration: faker.number.int({ min: 1000 }),
			EndTime: faker.date.future({ refDate: now }).toISOString(),
			StartTime: now,
		};
		const closeCommand = makeCloseGameSessionCommand(closeRequestDto);

		// Act
		const openResult = api.gameSession.commands
			.getOpenGameSessionCommandHandler()
			.execute(openCommand);
		const closeResult = api.gameSession.commands
			.getCloseGameSessionCommandHandler()
			.execute(closeCommand);

		// Assert
		expect(openResult.success).toBe(true);
		expect(openResult.reason_code).toBe("opened_game_session_created");

		expect(closeResult.success).toBe(true);
		expect(closeResult.reason_code).toBe("closed_in_progress_game_session");

		expect(events).toHaveLength(2);
		expect(events).toEqual([
			expect.objectContaining({
				name: "opened-game-session",
				payload: {
					gameId,
					sessionId: GameSessionIdParser.fromExternal(sessionId),
				},
			} satisfies Partial<DomainEvent>),
			expect.objectContaining({
				name: "closed-game-session",
				payload: {
					gameId,
					sessionId: GameSessionIdParser.fromExternal(sessionId),
				},
			} satisfies Partial<DomainEvent>),
		]);
	});

	it("creates a new closed session when in progress doesn't exist", () => {
		// Arrange
		const now = new Date().toISOString();
		const gameId = game.getId();
		const sessionId = faker.string.uuid();

		const closeRequestDto: CloseGameSessionRequestDto = {
			ClientUtcNow: now,
			GameId: gameId,
			SessionId: sessionId,
			Duration: faker.number.int({ min: 1000 }),
			EndTime: faker.date.future({ refDate: now }).toISOString(),
			StartTime: now,
		};
		const closeCommand = makeCloseGameSessionCommand(closeRequestDto);

		// Act
		const closeResult = api.gameSession.commands
			.getCloseGameSessionCommandHandler()
			.execute(closeCommand);

		// Assert
		expect(closeResult.success).toBe(true);
		expect(closeResult.reason_code).toBe("closed_game_session_created");

		expect(events).toHaveLength(1);
		expect(events).toEqual([
			expect.objectContaining({
				name: "closed-game-session",
				payload: {
					gameId,
					sessionId: GameSessionIdParser.fromExternal(sessionId),
				},
			} satisfies Partial<DomainEvent>),
		]);
	});

	it("gracefully handles closing an already closed session", () => {
		// Arrange
		const now = new Date().toISOString();
		const gameId = game.getId();
		const sessionId = faker.string.uuid();

		const closeRequestDto: CloseGameSessionRequestDto = {
			ClientUtcNow: now,
			GameId: gameId,
			SessionId: sessionId,
			Duration: faker.number.int({ min: 1000 }),
			EndTime: faker.date.future({ refDate: now }).toISOString(),
			StartTime: now,
		};
		const closeCommand = makeCloseGameSessionCommand(closeRequestDto);

		// Act
		const closeResult1 = api.gameSession.commands
			.getCloseGameSessionCommandHandler()
			.execute(closeCommand);
		const closeResult2 = api.gameSession.commands
			.getCloseGameSessionCommandHandler()
			.execute(closeCommand);

		// Assert
		expect(closeResult1.success).toBe(true);
		expect(closeResult1.reason_code).toBe("closed_game_session_created");

		expect(closeResult2.success).toBe(true);
		expect(closeResult2.reason_code).toBe("game_session_is_already_closed");

		expect(events).toHaveLength(1);
		expect(events).toEqual([
			expect.objectContaining({
				name: "closed-game-session",
				payload: {
					gameId,
					sessionId: GameSessionIdParser.fromExternal(sessionId),
				},
			} satisfies Partial<DomainEvent>),
		]);
	});
});
