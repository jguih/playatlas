import { faker } from "@faker-js/faker";
import { GameIdParser, PlayniteGameIdParser } from "@playatlas/common/domain";
import { makeSyncGamesCommand } from "@playatlas/playnite-integration/commands";
import { beforeEach, describe, expect, it } from "vitest";
import { api, factory, root } from "../vitest.global.setup";

describe("Game Library / Game", () => {
	beforeEach(() => {
		root.seedGameRelationships();
	});

	it("persists games", () => {
		// Arrange
		const games = factory.getGameFactory().buildList(10);
		const randomGame = faker.helpers.arrayElement(games);

		// Act
		root.seedGame(games);
		const queryResult = api.gameLibrary.queries.getGetAllGamesQueryHandler().execute();
		const added = queryResult.data;
		const addedRandomGame = added.find((g) => g.Id === randomGame.getId());

		// Assert
		expect(added).toHaveLength(games.length);
		expect(addedRandomGame).toBeDefined();
		expect(addedRandomGame!.Playnite?.Name).toBe(randomGame.getPlayniteSnapshot()?.name);
		expect(addedRandomGame!.CompletionStatusId).toBe(randomGame.getCompletionStatusId());
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
		const games = result.data;
		const insertedGame = games?.find((g) => g.Id === game.getId());

		// Assert
		expect(games).toBeTruthy();
		expect(insertedGame).toBeDefined();
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
		const games = result.data;
		const insertedGame = games?.find((g) => g.Id === game.getId());

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
		const games = result.data;
		const insertedGame = games?.find((g) => g.Id === game.getId());

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
		const games = result.data;
		const insertedGame = games?.find((g) => g.Id === game.getId());

		// Assert
		expect(games).toBeTruthy();
		expect(insertedGame).toBeTruthy();
		expect(new Set(insertedGame?.Platforms)).toEqual(new Set([platformId]));
	});

	it("returns game manifest data", async () => {
		// Arrange
		const game = factory.getGameFactory().build();
		const gameId = game.getPlayniteSnapshot()?.id;
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
		const games = result.data;

		// Assert
		expect(games).toHaveLength(0);
	});

	it("returns all games with large list", () => {
		// Arrange
		const listLength = 10000;
		const games = factory.getGameFactory().buildList(listLength);
		const gameIds = games.map((g) => g.getId());
		const oneGame = faker.helpers.arrayElement(games);
		const oneGamePlayniteSnapshot = oneGame.getPlayniteSnapshot();
		root.seedGame(games);

		// Act
		const queryResult = api.gameLibrary.queries.getGetAllGamesQueryHandler().execute();
		const queryGames = queryResult.data;
		const oneResult = queryGames.find((g) => g.Id === oneGame.getId());

		// Assert
		expect(queryGames).toHaveLength(listLength);
		expect(queryGames.every((g) => gameIds.includes(GameIdParser.fromExternal(g.Id)))).toBeTruthy();

		expect(oneResult).toBeDefined();
		expect(oneResult?.Playnite).toBeDefined();
		expect(oneResult!.Playnite!.Name).toBe(oneGamePlayniteSnapshot?.name);
		expect(oneResult!.Playnite!.Description).toBe(oneGamePlayniteSnapshot?.description);
		expect(oneResult!.Playnite!.ReleaseDate).toBe(
			oneGamePlayniteSnapshot?.releaseDate?.toISOString() ?? null,
		);
		expect(oneResult!.Playnite!.Playtime).toBe(oneGamePlayniteSnapshot!.playtime);
		expect(oneResult!.Playnite?.LastActivity).toBe(
			oneGamePlayniteSnapshot?.lastActivity?.toISOString() ?? null,
		);
		expect(oneResult!.Playnite!.Added).toBe(oneGamePlayniteSnapshot?.added?.toISOString() ?? null);
		expect(oneResult!.Playnite!.InstallDirectory).toBe(oneGamePlayniteSnapshot?.installDirectory);
		expect(oneResult!.Playnite!.IsInstalled).toBe(oneGamePlayniteSnapshot?.isInstalled);
		expect(oneResult!.Playnite!.BackgroundImagePath).toBe(oneGame.getBackgroundImagePath());
		expect(oneResult!.Playnite!.CoverImagePath).toBe(oneGame.getCoverImagePath());
		expect(oneResult!.Playnite!.IconImagePath).toBe(oneGame.getIconImagePath());
		expect(oneResult!.Playnite!.Hidden).toBe(oneGamePlayniteSnapshot?.hidden);
		expect(oneResult!.CompletionStatusId).toBe(oneGame.getCompletionStatusId());
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
		const games = result.data;
		const oneResult = games.find((g) => g.Id === game.getId());

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
				backgroundImagePath: null,
				coverImagePath: null,
				iconImagePath: null,
				hidden: false,
				id: PlayniteGameIdParser.fromTrusted(faker.string.uuid()),
				isInstalled: false,
				playtime: 0,
				completionStatusId: null,
			},
		});
		root.seedGame([game]);

		// Act
		const result = api.gameLibrary.queries.getGetAllGamesQueryHandler().execute();
		const games = result.data;
		const oneResult = games.find((g) => g.Id === game.getId());

		// Assert
		expect(oneResult).toBeDefined();
		expect(oneResult?.Playnite).toBeDefined();
		expect(oneResult!.Playnite!.Name).toBeNull();
		expect(oneResult!.Playnite!.Description).toBeNull();
		expect(oneResult!.Playnite!.ReleaseDate).toBeNull();
		expect(oneResult!.Playnite!.LastActivity).toBeNull();
		expect(oneResult!.Playnite!.Added).toBeNull();
		expect(oneResult!.Playnite!.InstallDirectory).toBeNull();
	});

	it("deletion don't actually delete games, but mark them as deleted", async () => {
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

		root.clock.advance(1000);
		const deletedAtTime = root.clock.now();

		const itemsToDelete = faker.helpers.arrayElements(syncItems, 20);
		const deleteCommand = makeSyncGamesCommand({
			AddedItems: [],
			RemovedItems: itemsToDelete.map((i) => i.Id),
			UpdatedItems: [],
		});

		const deleteResult = await api.playniteIntegration.commands
			.getSyncGamesCommandHandler()
			.executeAsync(deleteCommand);
		expect(deleteResult.success).toBe(true);

		// Act
		const queryResult = api.gameLibrary.queries.getGetAllGamesQueryHandler().execute();
		const games = queryResult.data;
		const deletedGames = games.filter((g) => g.Sync.DeletedAt !== null);

		// Assert
		expect(games).toHaveLength(200);
		expect(deletedGames).toHaveLength(20);
		expect(
			deletedGames.every((g) => new Date(g.Sync.DeletedAt!).getTime() >= deletedAtTime.getTime()),
		).toBe(true);

		const uniqueDeletedAt = new Set(deletedGames.map((g) => g.Sync.DeletedAt));
		expect(uniqueDeletedAt.size).toBe(1);
	});
});
