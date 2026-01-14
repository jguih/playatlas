import { faker } from "@faker-js/faker";
import { GameIdParser, GameSessionIdParser, InvalidStateError } from "@playatlas/common/domain";
import { describe, expect, it } from "vitest";
import { makeClosedGameSession, makeGameSession } from "./game-session.entity";

describe("Game Session Domain", () => {
	const sessionId = GameSessionIdParser.fromExternal("session-1");

	it("closes a game session", () => {
		// Arrange
		const utcNow = Date.now();
		const gameId = GameIdParser.fromExternal(faker.string.uuid());
		const startTime = new Date(utcNow);
		const endTime = faker.date.future({ refDate: startTime });
		const duration = faker.number.int({ min: 100 });

		const session = makeGameSession({
			sessionId,
			startTime,
			gameId,
			gameName: faker.lorem.words({ min: 1, max: 3 }),
		});

		// Act
		session.close({ endTime, duration });

		// Assert
		expect(session.isClosed()).toBe(true);
	});

	it.each([{ duration: 0 }, { duration: -10 }, { duration: -200 }, { duration: -999999 }])(
		"throws if duration is $duration",
		({ duration }) => {
			// Arrange
			const utcNow = Date.now();
			const gameId = GameIdParser.fromExternal(faker.string.uuid());
			const startTime = new Date(utcNow);
			const endTime = faker.date.future({ refDate: startTime });

			// Act & Assert
			expect(() =>
				makeClosedGameSession({
					sessionId,
					startTime,
					gameId,
					gameName: faker.lorem.words({ min: 1, max: 3 }),
					duration,
					endTime,
				}),
			).toThrow(InvalidStateError);
		},
	);

	it("throws if end time is earlier than start time", () => {
		// Arrange
		const utcNow = Date.now();
		const gameId = GameIdParser.fromExternal(faker.string.uuid());
		const endTime = new Date(utcNow);
		const startTime = faker.date.future({ refDate: endTime });
		const duration = faker.number.int({ min: 100 });

		// Act & Assert
		expect(() =>
			makeClosedGameSession({
				sessionId,
				startTime,
				gameId,
				gameName: faker.lorem.words({ min: 1, max: 3 }),
				duration,
				endTime,
			}),
		).toThrow(InvalidStateError);
	});

	it("throws if end time is equal to start time", () => {
		// Arrange
		const utcNow = Date.now();
		const gameId = GameIdParser.fromExternal(faker.string.uuid());
		const startTime = new Date(utcNow);
		const endTime = startTime;
		const duration = faker.number.int({ min: 100 });

		// Act & Assert
		expect(() =>
			makeClosedGameSession({
				sessionId,
				startTime,
				gameId,
				gameName: faker.lorem.words({ min: 1, max: 3 }),
				duration,
				endTime,
			}),
		).toThrow(InvalidStateError);
	});
});
