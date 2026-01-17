import { faker } from "@faker-js/faker";
import { PlayniteGameIdParser } from "@playatlas/common/domain";
import {
	makeSyncGamesCommand,
	type SyncGamesRequestDtoItem,
} from "@playatlas/playnite-integration/commands";
import { describe, expect, it } from "vitest";
import { api, factory, root } from "../vitest.global.setup";

describe("Game Library / Game", () => {
	it("persists games", () => {
		// Arrange
		const games = factory.getGameFactory().buildList(10);
		const randomGame = faker.helpers.arrayElement(games);

		// Act
		root.seedGame(games);
		const queryResult = api.gameLibrary.queries.getGetAllGamesQueryHandler().execute();
		const added = queryResult.type === "ok" ? queryResult.data : [];
		const addedRandomGame = added.find((g) => g.Id === randomGame.getPlayniteSnapshot().id);

		// Assert
		expect(added).toHaveLength(games.length);
		expect(addedRandomGame?.Id).toBe(randomGame.getPlayniteSnapshot().id);
		expect(addedRandomGame?.Name).toBe(randomGame.getPlayniteSnapshot().name);
		expect(addedRandomGame?.CompletionStatusId).toBe(
			randomGame.getPlayniteSnapshot().completionStatusId,
		);
	});

	it("persists a game and eager load its developers", () => {
		// Arrange
		const dev = factory.getCompanyFactory().build();
		const devId = dev.getId();
		root.seedCompany(dev);

		const game = factory.getGameFactory().build({ developerIds: [devId] });
		root.seedGame(game);

		// Act
		const result = api.gameLibrary.queries.getGetAllGamesQueryHandler().execute();
		const games = result.type === "ok" ? result.data : null;
		const insertedGame = games?.find((g) => g.Id === game.getPlayniteSnapshot().id);

		// Assert
		expect(games).toBeTruthy();
		expect(insertedGame).toBeTruthy();
		expect(new Set(insertedGame?.Developers)).toEqual(new Set([devId]));
	});

	it("persists a game and eager load its publishers", () => {
		// Arrange
		const publisher = factory.getCompanyFactory().build();
		const publisherId = publisher.getId();
		root.seedCompany(publisher);

		const game = factory.getGameFactory().build({ publisherIds: [publisherId] });
		root.seedGame(game);

		// Act
		const result = api.gameLibrary.queries.getGetAllGamesQueryHandler().execute();
		const games = result.type === "ok" ? result.data : null;
		const insertedGame = games?.find((g) => g.Id === game.getPlayniteSnapshot().id);

		// Assert
		expect(games).toBeTruthy();
		expect(insertedGame).toBeTruthy();
		expect(new Set(insertedGame?.Publishers)).toEqual(new Set([publisherId]));
	});

	it("persists a game and eager load its genres", () => {
		// Arrange
		const genre = factory.getGenreFactory().build();
		const genreId = genre.getId();
		root.seedGenre(genre);

		const game = factory.getGameFactory().build({ genreIds: [genreId] });
		root.seedGame(game);

		// Act
		const result = api.gameLibrary.queries.getGetAllGamesQueryHandler().execute();
		const games = result.type === "ok" ? result.data : null;
		const insertedGame = games?.find((g) => g.Id === game.getPlayniteSnapshot().id);

		// Assert
		expect(games).toBeTruthy();
		expect(insertedGame).toBeTruthy();
		expect(new Set(insertedGame?.Genres)).toEqual(new Set([genreId]));
	});

	it("persists a game and eager load its platforms", () => {
		// Arrange
		const platform = factory.getPlatformFactory().build();
		const platformId = platform.getId();
		root.seedPlatform(platform);

		const game = factory.getGameFactory().build({ platformIds: [platformId] });
		root.seedGame(game);

		// Act
		const result = api.gameLibrary.queries.getGetAllGamesQueryHandler().execute();
		const games = result.type === "ok" ? result.data : null;
		const insertedGame = games?.find((g) => g.Id === game.getPlayniteSnapshot().id);

		// Assert
		expect(games).toBeTruthy();
		expect(insertedGame).toBeTruthy();
		expect(new Set(insertedGame?.Platforms)).toEqual(new Set([platformId]));
	});

	it("returns game manifest data", async () => {
		// Arrange
		const game = factory.getGameFactory().build();
		const gameId = game.getPlayniteSnapshot().id;
		root.seedGame(game);

		// Act
		await api.playniteIntegration.getLibraryManifestService().write();
		const manifest = await api.playniteIntegration.getLibraryManifestService().get();

		// Assert
		expect(manifest).toBeTruthy();
		expect(manifest?.gamesInLibrary.map((g) => g.gameId)).toContain(gameId);
	});

	it("returns empty games array", () => {
		// Act
		const result = api.gameLibrary.queries.getGetAllGamesQueryHandler().execute();
		const games = result.type === "ok" ? result.data : [];

		// Assert
		expect(games).toHaveLength(0);
	});

	it("returns all games with large list", () => {
		// Arrange
		const listLength = 2000;
		const games = factory.getGameFactory().buildList(listLength);
		const gameIds = games.map((g) => g.getPlayniteSnapshot().id);
		const oneGame = faker.helpers.arrayElement(games);
		const oneGamePlayniteSnapshot = oneGame.getPlayniteSnapshot();
		root.seedGame(games);

		// Act
		const queryResult = api.gameLibrary.queries.getGetAllGamesQueryHandler().execute();
		const queryGames = queryResult.type === "ok" ? queryResult.data : [];
		const oneResult = queryGames.find((g) => g.Id === oneGame.getPlayniteSnapshot().id);

		// Assert
		expect(queryGames).toHaveLength(listLength);
		expect(
			queryGames.every((g) => gameIds.includes(PlayniteGameIdParser.fromExternal(g.Id))),
		).toBeTruthy();

		expect(oneResult).toBeDefined();
		expect(oneResult!.Name).toBe(oneGamePlayniteSnapshot.name);
		expect(oneResult!.Description).toBe(oneGamePlayniteSnapshot.description);
		expect(oneResult!.ReleaseDate).toBe(oneGamePlayniteSnapshot.releaseDate?.toISOString() ?? null);
		expect(oneResult!.Playtime).toBe(oneGamePlayniteSnapshot.playtime);
		expect(oneResult!.LastActivity).toBe(
			oneGamePlayniteSnapshot.lastActivity?.toISOString() ?? null,
		);
		expect(oneResult!.Added).toBe(oneGamePlayniteSnapshot.added?.toISOString() ?? null);
		expect(oneResult!.InstallDirectory).toBe(oneGamePlayniteSnapshot.installDirectory);
		expect(oneResult!.IsInstalled).toBe(+oneGamePlayniteSnapshot.isInstalled);
		expect(oneResult!.Assets.BackgroundImagePath).toBe(oneGame.getBackgroundImagePath());
		expect(oneResult!.Assets.CoverImagePath).toBe(oneGame.getCoverImagePath());
		expect(oneResult!.Assets.IconImagePath).toBe(oneGame.getIconImagePath());
		expect(oneResult!.Hidden).toBe(+oneGamePlayniteSnapshot.hidden);
		expect(oneResult!.CompletionStatusId).toBe(oneGamePlayniteSnapshot.completionStatusId);
		expect(oneResult!.ContentHash).toBe(oneGame.getContentHash());
		expect(new Set(oneResult!.Developers)).toEqual(new Set(oneGame.relationships.developers.get()));
		expect(new Set(oneResult!.Publishers)).toEqual(new Set(oneGame.relationships.publishers.get()));
		expect(new Set(oneResult!.Genres)).toEqual(new Set(oneGame.relationships.genres.get()));
		expect(new Set(oneResult!.Platforms)).toEqual(new Set(oneGame.relationships.platforms.get()));
		// Ensure no duplicate ids
		expect(oneResult!.Developers).toEqual([...new Set(oneResult!.Developers)]);
		expect(oneResult!.Publishers).toEqual([...new Set(oneResult!.Publishers)]);
		expect(oneResult!.Genres).toEqual([...new Set(oneResult!.Genres)]);
		expect(oneResult!.Platforms).toEqual([...new Set(oneResult!.Platforms)]);
	});

	it("returns empty array when no relationship", () => {
		// Arrange
		const game = factory.getGameFactory().build({
			genreIds: null,
			platformIds: null,
			developerIds: null,
			publisherIds: null,
		});
		root.seedGame([game]);

		// Act
		const result = api.gameLibrary.queries.getGetAllGamesQueryHandler().execute();
		const games = result.type === "ok" ? result.data : [];
		const oneResult = games.find((g) => g.Id === game.getPlayniteSnapshot().id);

		// Assert
		expect(oneResult).toBeDefined();
		expect(oneResult!.Developers).toHaveLength(0);
		expect(oneResult!.Platforms).toHaveLength(0);
		expect(oneResult!.Genres).toHaveLength(0);
		expect(oneResult!.Publishers).toHaveLength(0);
	});

	it("shows null values as null and not empty string", () => {
		// Arrange
		const game = factory.getGameFactory().build({
			playniteSnapshot: {
				name: null,
				description: null,
				releaseDate: null,
				lastActivity: null,
				added: null,
				installDirectory: null,
				backgroundImage: null,
				coverImage: null,
				icon: null,
				completionStatusId: null,
				hidden: false,
				id: PlayniteGameIdParser.fromTrusted(faker.string.uuid()),
				isInstalled: false,
				playtime: 0,
			},
		});
		root.seedGame([game]);

		// Act
		const result = api.gameLibrary.queries.getGetAllGamesQueryHandler().execute();
		const games = result.type === "ok" ? result.data : [];
		const oneResult = games.find((g) => g.Id === game.getPlayniteSnapshot().id);

		// Assert
		expect(oneResult).toBeDefined();
		expect(oneResult!.Name).toBeNull();
		expect(oneResult!.Description).toBeNull();
		expect(oneResult!.ReleaseDate).toBeNull();
		expect(oneResult!.LastActivity).toBeNull();
		expect(oneResult!.Added).toBeNull();
		expect(oneResult!.InstallDirectory).toBeNull();
		expect(oneResult!.CompletionStatusId).toBeNull();
	});

	it("returns 'not_modified' when provided a valid etag", () => {
		// Arrange
		const games = factory.getGameFactory().buildList(200);
		root.seedGame(games);
		// Act
		const result = api.gameLibrary.queries.getGetAllGamesQueryHandler().execute();
		if (result.type !== "ok") throw new Error("Invalid result type");
		const afterResult = api.gameLibrary.queries
			.getGetAllGamesQueryHandler()
			.execute({ ifNoneMatch: result.etag });
		// Assert
		expect(afterResult.type === "not_modified").toBeTruthy();
	});

	it("only returns updated games", async () => {
		// Arrange
		root.clock.setCurrent(new Date("2026-01-01T00:00:00Z"));

		const syncItems = factory.getSyncGameRequestDtoFactory().buildList(200);

		const seedCommand = makeSyncGamesCommand({
			AddedItems: syncItems,
			RemovedItems: [],
			UpdatedItems: [],
		});

		const seedResult = await api.playniteIntegration.commands
			.getSyncGamesCommandHandler()
			.executeAsync(seedCommand);
		expect(seedResult.success).toBe(true);

		const since = root.clock.now();
		root.clock.advance(1000);

		const itemsToUpdate = faker.helpers.arrayElements(syncItems, 20);
		const updatedItems: SyncGamesRequestDtoItem[] = itemsToUpdate.map((i) => ({
			...i,
			Name: `${i.Name} (Updated)`,
			ContentHash: faker.string.uuid(),
		}));
		const updateCommand = makeSyncGamesCommand({
			AddedItems: [],
			RemovedItems: [],
			UpdatedItems: updatedItems,
		});

		const updateResult = await api.playniteIntegration.commands
			.getSyncGamesCommandHandler()
			.executeAsync(updateCommand);

		// Act
		const queryResult = api.gameLibrary.queries.getGetAllGamesQueryHandler().execute({ since });
		const games = queryResult.type === "ok" ? queryResult.data : [];

		// Assert
		expect(updateResult.success).toBe(true);
		expect(games).toHaveLength(20);
	});
});
