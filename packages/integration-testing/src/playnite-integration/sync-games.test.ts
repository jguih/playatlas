import { faker } from "@faker-js/faker";
import type { DomainEvent } from "@playatlas/common/application";
import { GameIdParser } from "@playatlas/common/domain";
import type { GameResponseDto } from "@playatlas/game-library/dtos";
import {
	makeSyncGamesCommand,
	type SyncGamesRequestDto,
} from "@playatlas/playnite-integration/commands";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { recordDomainEvents } from "../test.lib";
import { api, factory } from "../vitest.global.setup";

describe("Game Library Sync", () => {
	let unsubscribe: () => void;
	let events: DomainEvent[];

	beforeEach(() => {
		({ events, unsubscribe } = recordDomainEvents());
	});

	afterEach(() => {
		unsubscribe();
	});

	it("adds games", async () => {
		// Arrange
		const addedItems = factory.getSyncGameRequestDtoFactory().buildList(2000);
		const addedGameIds = addedItems.map((i) => i.Id);
		const sampleGame = faker.helpers.arrayElement(addedItems);
		const requestDto: SyncGamesRequestDto = {
			AddedItems: addedItems,
			RemovedItems: [],
			UpdatedItems: [],
		};
		const command = makeSyncGamesCommand(requestDto);

		// Act
		const commandResult = await api.playniteIntegration.commands
			.getSyncGamesCommandHandler()
			.executeAsync(command);
		const queryResult = api.gameLibrary.queries.getGetAllGamesQueryHandler().execute();
		const games = queryResult.type === "ok" ? queryResult.data : [];
		const persistedGame = games.find((g) => g.Id === sampleGame.Id);

		// Assert
		expect(commandResult.success).toBe(true);
		expect(commandResult.reason_code).toBe("game_library_synchronized");

		expect(new Set(games.map((g) => g.Id)).size).toBe(2000);
		expect(games.every((g) => addedGameIds.includes(g.Id))).toBe(true);

		expect(persistedGame).toBeDefined();
		expect(sampleGame).toMatchObject({
			Id: persistedGame?.Id,
			Name: persistedGame?.Name,
			Description: persistedGame?.Description,
		} satisfies Partial<GameResponseDto>);
		expect(new Set(sampleGame.Genres?.map((g) => g.Id))).toEqual(new Set(persistedGame?.Genres));

		expect(events).toHaveLength(1);

		const event = events.at(0);
		const syncEvent = event && event.name === "game-library-synchronized" ? event : null;

		expect(syncEvent).not.toBeNull();
		expect(new Set(syncEvent!.payload.added)).toEqual(
			new Set(addedGameIds.map(GameIdParser.fromExternal)),
		);
		expect(syncEvent!.payload.deleted).toHaveLength(0);
		expect(syncEvent!.payload.updated).toHaveLength(0);
	});

	it("removes games", async () => {
		// Arrange
		const initialGames = factory.getSyncGameRequestDtoFactory().buildList(2000);
		const removedGames = faker.helpers.arrayElements(initialGames, 500);
		const removedGameIds = removedGames.map((i) => i.Id);

		const remainingGames = initialGames.filter((g) => !removedGameIds.includes(g.Id));
		const remainingGameIds = remainingGames.map((i) => i.Id);

		const seedCommand = makeSyncGamesCommand({
			AddedItems: initialGames,
			RemovedItems: [],
			UpdatedItems: [],
		});

		await api.playniteIntegration.commands.getSyncGamesCommandHandler().executeAsync(seedCommand);

		events.length = 0;

		const removeCommand = makeSyncGamesCommand({
			AddedItems: [],
			RemovedItems: removedGames.map((i) => i.Id),
			UpdatedItems: [],
		});

		// Act
		const commandResult = await api.playniteIntegration.commands
			.getSyncGamesCommandHandler()
			.executeAsync(removeCommand);
		const queryResult = api.gameLibrary.queries.getGetAllGamesQueryHandler().execute();
		const games = queryResult.type === "ok" ? queryResult.data : [];

		// Assert
		expect(commandResult.success).toBe(true);
		expect(commandResult.reason_code).toBe("game_library_synchronized");

		expect(games).toHaveLength(remainingGames.length);
		expect(new Set(games.map((g) => g.Id))).toEqual(new Set(remainingGameIds));

		expect(events).toHaveLength(1);

		const event = events.at(0);
		const syncEvent = event && event.name === "game-library-synchronized" ? event : null;

		expect(syncEvent).not.toBeNull();
		expect(new Set(syncEvent!.payload.deleted)).toEqual(
			new Set(removedGameIds.map(GameIdParser.fromExternal)),
		);
		expect(syncEvent!.payload.added).toHaveLength(0);
		expect(syncEvent!.payload.updated).toHaveLength(0);
	});

	it("updates games", async () => {
		// Arrange
		const genreOptions = faker.helpers.arrayElements(
			factory.getSyncGameRequestDtoFactory().genreOptions,
			{ min: 3, max: 3 },
		);
		const initialGames = factory.getSyncGameRequestDtoFactory().buildList(2000);
		const gamesToUpdate = faker.helpers.arrayElements(initialGames, 500);

		const updatedGames = gamesToUpdate.map((game) => ({
			...game,
			Name: `${game.Name} (Updated)`,
			Description: faker.lorem.paragraph(),
			Genres: genreOptions,
		}));
		const updatedGameIds = updatedGames.map((i) => i.Id);

		const untouchedGames = initialGames.filter((g) => !updatedGameIds.includes(g.Id));

		const seedCommand = makeSyncGamesCommand({
			AddedItems: initialGames,
			RemovedItems: [],
			UpdatedItems: [],
		});

		await api.playniteIntegration.commands.getSyncGamesCommandHandler().executeAsync(seedCommand);

		events.length = 0;

		const updateCommand = makeSyncGamesCommand({
			AddedItems: [],
			RemovedItems: [],
			UpdatedItems: updatedGames,
		});

		// Act
		const commandResult = await api.playniteIntegration.commands
			.getSyncGamesCommandHandler()
			.executeAsync(updateCommand);

		const queryResult = api.gameLibrary.queries.getGetAllGamesQueryHandler().execute();
		const games = queryResult.type === "ok" ? queryResult.data : [];

		// Assert
		expect(commandResult.success).toBe(true);
		expect(commandResult.reason_code).toBe("game_library_synchronized");

		expect(games).toHaveLength(initialGames.length);
		expect(new Set(games.map((g) => g.Id))).toEqual(new Set(initialGames.map((g) => g.Id)));

		for (const updated of updatedGames) {
			const persisted = games.find((g) => g.Id === updated.Id);
			expect(persisted).toBeDefined();
			expect(persisted).toMatchObject({
				Id: updated?.Id,
				Name: updated?.Name,
				Description: updated?.Description,
			} satisfies Partial<GameResponseDto>);
			expect(persisted!.Name).toMatch(/\(Updated\)$/);
			expect(new Set(updated.Genres.map((g) => g.Id))).toEqual(new Set(persisted?.Genres));
		}

		for (const game of untouchedGames) {
			const persisted = games.find((g) => g.Id === game.Id);
			expect(persisted).toBeDefined();
			expect(persisted!.Name).not.toMatch(/\(Updated\)/);
		}

		expect(events).toHaveLength(1);

		const event = events.at(0);
		const syncEvent = event && event.name === "game-library-synchronized" ? event : null;

		expect(syncEvent).not.toBeNull();
		expect(new Set(syncEvent!.payload.updated)).toEqual(
			new Set(updatedGameIds.map(GameIdParser.fromExternal)),
		);
		expect(syncEvent!.payload.added).toHaveLength(0);
		expect(syncEvent!.payload.deleted).toHaveLength(0);
	});
});
