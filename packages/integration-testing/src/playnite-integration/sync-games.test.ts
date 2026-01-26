import { faker } from "@faker-js/faker";
import type { DomainEvent } from "@playatlas/common/application";
import { GameIdParser, PlayniteGameIdParser } from "@playatlas/common/domain";
import type { PlayniteProjectionResponseDto } from "@playatlas/game-library/dtos";
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
		const addedItems = factory.getSyncGameRequestDtoFactory().buildList(5000);
		const addedItemIds = addedItems.map((i) => i.Id);
		const sampleItem = faker.helpers.arrayElement(addedItems);
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
		const games = queryResult.data;
		const persistedGame = games.find((g) => g.Id === sampleItem.Id);

		// Assert
		expect(commandResult.success).toBe(true);
		expect(commandResult.reason_code).toBe("game_library_synchronized");

		expect(new Set(games.map((g) => g.Id)).size).toBe(5000);
		expect(games.every((g) => addedItemIds.includes(g.Id))).toBe(true);

		expect(persistedGame).toBeDefined();
		expect(sampleItem).toMatchObject({
			Id: persistedGame?.Id,
			Name: persistedGame?.Name,
			Description: persistedGame?.Description,
		} satisfies Partial<PlayniteProjectionResponseDto>);
		expect(new Set(sampleItem.Genres?.map((g) => g.Id))).toEqual(new Set(persistedGame?.Genres));

		expect(events).toHaveLength(1);

		const event = events.at(0);
		const syncEvent = event && event.name === "game-library-synchronized" ? event : null;

		expect(syncEvent).not.toBeNull();
		expect(new Set(syncEvent!.payload.added)).toEqual(
			new Set(addedItemIds.map(GameIdParser.fromExternal)),
		);
		expect(syncEvent!.payload.deleted).toHaveLength(0);
		expect(syncEvent!.payload.updated).toHaveLength(0);
	});

	it("removes games", async () => {
		// Arrange
		const initialItems = factory.getSyncGameRequestDtoFactory().buildList(2000);
		const removedItems = faker.helpers.arrayElements(initialItems, 500);
		const removedItemIds = removedItems.map((i) => i.Id);

		const remainingGames = initialItems.filter((g) => !removedItemIds.includes(g.Id));
		const remainingGameIds = remainingGames.map((i) => i.Id);

		const seedCommand = makeSyncGamesCommand({
			AddedItems: initialItems,
			RemovedItems: [],
			UpdatedItems: [],
		});

		await api.playniteIntegration.commands.getSyncGamesCommandHandler().executeAsync(seedCommand);

		events.length = 0;

		const removeCommand = makeSyncGamesCommand({
			AddedItems: [],
			RemovedItems: removedItems.map((i) => i.Id),
			UpdatedItems: [],
		});

		// Act
		const commandResult = await api.playniteIntegration.commands
			.getSyncGamesCommandHandler()
			.executeAsync(removeCommand);
		const queryResult = api.gameLibrary.queries.getGetAllGamesQueryHandler().execute();
		const games = queryResult.data;
		const visibleGames = games.filter((g) => g.Sync.DeletedAt === null);

		// Assert
		expect(commandResult.success).toBe(true);
		expect(commandResult.reason_code).toBe("game_library_synchronized");

		expect(visibleGames).toHaveLength(remainingGames.length);
		expect(new Set(visibleGames.map((g) => g.Id))).toEqual(new Set(remainingGameIds));

		expect(events).toHaveLength(1);

		const event = events.at(0);
		const syncEvent = event && event.name === "game-library-synchronized" ? event : null;

		expect(syncEvent).not.toBeNull();
		expect(new Set(syncEvent!.payload.deleted)).toEqual(
			new Set(removedItemIds.map(GameIdParser.fromExternal)),
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
		const initialSyncItems = factory.getSyncGameRequestDtoFactory().buildList(2000);
		const itemsToUpdate = faker.helpers.arrayElements(initialSyncItems, 500);

		const updatedItems = itemsToUpdate.map((game) => ({
			...game,
			Name: `${game.Name} (Updated)`,
			Description: faker.lorem.paragraph(),
			Genres: genreOptions,
			ContentHash: faker.string.uuid(),
		}));
		const updatedItemIds = updatedItems.map((i) => i.Id);

		const untouchedItems = initialSyncItems.filter((g) => !updatedItemIds.includes(g.Id));

		const seedCommand = makeSyncGamesCommand({
			AddedItems: initialSyncItems,
			RemovedItems: [],
			UpdatedItems: [],
		});

		await api.playniteIntegration.commands.getSyncGamesCommandHandler().executeAsync(seedCommand);

		events.length = 0;

		const updateCommand = makeSyncGamesCommand({
			AddedItems: [],
			RemovedItems: [],
			UpdatedItems: updatedItems,
		});

		// Act
		const commandResult = await api.playniteIntegration.commands
			.getSyncGamesCommandHandler()
			.executeAsync(updateCommand);

		const queryResult = api.gameLibrary.queries.getGetAllGamesQueryHandler().execute();
		const games = queryResult.data;

		// Assert
		expect(commandResult.success).toBe(true);
		expect(commandResult.reason_code).toBe("game_library_synchronized");

		expect(games).toHaveLength(initialSyncItems.length);
		expect(new Set(games.map((g) => g.Id))).toEqual(new Set(initialSyncItems.map((g) => g.Id)));

		for (const updated of updatedItems) {
			const persisted = games.find((g) => g.Id === updated.Id);
			expect(persisted).toBeDefined();
			expect(persisted).toMatchObject({
				Id: updated?.Id,
				Name: updated?.Name,
				Description: updated?.Description,
			} satisfies Partial<PlayniteProjectionResponseDto>);
			expect(persisted!.Name).toMatch(/\(Updated\)$/);
			expect(new Set(updated.Genres.map((g) => g.Id))).toEqual(new Set(persisted?.Genres));
		}

		for (const game of untouchedItems) {
			const persisted = games.find((g) => g.Id === game.Id);
			expect(persisted).toBeDefined();
			expect(persisted!.Name).not.toMatch(/\(Updated\)/);
		}

		expect(events).toHaveLength(1);

		const event = events.at(0);
		const syncEvent = event && event.name === "game-library-synchronized" ? event : null;

		expect(syncEvent).not.toBeNull();
		expect(new Set(syncEvent!.payload.updated)).toEqual(
			new Set(updatedItemIds.map(PlayniteGameIdParser.fromExternal)),
		);
		expect(syncEvent!.payload.added).toHaveLength(0);
		expect(syncEvent!.payload.deleted).toHaveLength(0);
	});
});
