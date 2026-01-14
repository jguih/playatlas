import { faker } from "@faker-js/faker";
import type { DomainEvent } from "@playatlas/common/application";
import { GameSessionIdParser } from "@playatlas/common/domain";
import type { Game } from "@playatlas/game-library/domain";
import {
	makeOpenGameSessionCommand,
	type OpenGameSessionRequestDto,
} from "@playatlas/game-session/commands";
import { api, factory, root } from "../vitest.global.setup";

const recordDomainEvents = () => {
	const events: DomainEvent[] = [];
	const unsubscribe = api.getEventBus().subscribe((event) => events.push(event));
	return { events, unsubscribe };
};

describe("Game Sessions", () => {
	let game: Game;

	beforeEach(() => {
		game = factory.getGameFactory().build();
		root.seedGame(game);
	});

	it("opens a game session", () => {
		// Arrange
		const { events, unsubscribe } = recordDomainEvents();
		const now = new Date().toISOString();
		const sessionId = faker.string.uuid();
		const gameId = game.getId();

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

		unsubscribe();
	});

	it("fails when game doesn't exist", () => {
		// Arrange
		const { events, unsubscribe } = recordDomainEvents();
		const now = new Date().toISOString();
		const sessionId = faker.string.uuid();
		const gameId = faker.string.uuid();

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

		unsubscribe();
	});
});
