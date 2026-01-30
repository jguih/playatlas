import type { ClientApiV1 } from "$lib/modules/bootstrap/application";
import { TestCompositionRoot } from "$lib/modules/bootstrap/testing";
import { faker } from "@faker-js/faker";
import "fake-indexeddb/auto";
import type { Game } from "../game-library/domain";

describe("GameLibrary / Games", () => {
	let root: TestCompositionRoot;
	let api: ClientApiV1;

	beforeEach(async () => {
		root = new TestCompositionRoot();
		api = await root.buildAsync();
		vi.resetAllMocks();
	});

	afterEach(async () => {
		await root.cleanup();
	});

	it("persists and retrieves games", async () => {
		// Arrange
		const games = root.factories.game.buildList(200);

		await api.GameLibrary.Command.SyncGames.executeAsync({ games });

		// Act
		const { items } = await api.GameLibrary.Query.GetGames.executeAsync({
			limit: 200,
			sort: "recent",
		});

		// Assert
		expect(items).toHaveLength(200);
		for (let i = 1; i < items.length; i++) {
			expect(items[i - 1].SourceUpdatedAt >= items[i].SourceUpdatedAt).toBe(true);
		}
	});

	it("sync is idempotent", async () => {
		// Arrange
		const games = root.factories.game.buildList(50);

		// Act
		await api.GameLibrary.Command.SyncGames.executeAsync({ games });
		await api.GameLibrary.Command.SyncGames.executeAsync({ games });

		const result = await api.GameLibrary.Query.GetGames.executeAsync({
			limit: 100,
			sort: "recent",
		});

		// Assert
		expect(result.items).toHaveLength(50);
	});

	it("sync updates existing games", async () => {
		// Arrange
		const now = new Date();
		const games = root.factories.game.buildList(10);

		await api.GameLibrary.Command.SyncGames.executeAsync({ games });

		const updated: Game[] = games.map((g) => ({
			...g,
			Playnite: {
				...g.Playnite,
				Name: `${g.Playnite.Name} (updated)`,
			},
			SourceUpdatedAt: now,
		}));

		// Act
		await api.GameLibrary.Command.SyncGames.executeAsync({ games: updated });

		const result = await api.GameLibrary.Query.GetGames.executeAsync({
			limit: 10,
			sort: "recent",
		});

		// Assert
		expect(result.items[0].Playnite.Name).toContain("(updated)");
	});

	it("returns empty result when no games exist", async () => {
		const result = await api.GameLibrary.Query.GetGames.executeAsync({
			limit: 10,
			sort: "recent",
		});

		expect(result.items).toHaveLength(0);
		expect(result.nextKey).toBeNull();
	});

	it("handles large datasets", async () => {
		// Arrange
		const games = root.factories.game.buildList(1000);

		// Act
		await api.GameLibrary.Command.SyncGames.executeAsync({ games });

		const result = await api.GameLibrary.Query.GetGames.executeAsync({
			limit: 1000,
			sort: "recent",
		});

		// Assert
		expect(result.items).toHaveLength(1000);
	});

	it("does not overwrite newer local data with older server data", async () => {
		// Arrange
		const game: Game = { ...root.factories.game.build(), SourceUpdatedAt: new Date("2026-01-02") };
		await api.GameLibrary.Command.SyncGames.executeAsync({ games: game });

		// Act
		await api.GameLibrary.Command.SyncGames.executeAsync({
			games: {
				...game,
				Playnite: {
					...game.Playnite,
					Name: "Old name",
				},
				SourceUpdatedAt: new Date("2026-01-01"),
			},
		});
		const stored = await api.GameLibrary.Query.GetGames.executeAsync({ limit: 1, sort: "recent" });

		// Assert
		expect(stored.items[0].Playnite.Name).toBe(game.Playnite.Name);
	});

	it("revives a deleted game when server clears DeletedAt", async () => {
		// Arrange
		const game: Game = { ...root.factories.game.build(), DeletedAt: faker.date.recent() };

		await api.GameLibrary.Command.SyncGames.executeAsync({ games: game });

		await api.GameLibrary.Command.SyncGames.executeAsync({
			games: {
				...game,
				DeletedAt: null,
				SourceUpdatedAt: faker.date.future(),
			},
		});

		// Act
		const result = await api.GameLibrary.Query.GetGames.executeAsync({
			limit: 100,
			sort: "recent",
		});

		// Assert
		expect(result.items).toHaveLength(1);
	});

	it("does not return games marked as deleted", async () => {
		// Arrange
		const games: Game[] = root.factories.game.buildList(150).map((g) => {
			return {
				...g,
				DeletedAt: null,
				DeleteAfter: null,
			};
		});
		const deletedGames: Game[] = root.factories.game.buildList(50).map((g) => {
			return { ...g, DeletedAt: faker.date.recent(), DeleteAfter: faker.date.future() };
		});

		await api.GameLibrary.Command.SyncGames.executeAsync({ games: [...games, ...deletedGames] });

		// Act
		const result = await api.GameLibrary.Query.GetGames.executeAsync({
			limit: 200,
			sort: "recent",
		});

		// Assert
		expect(result.items).toHaveLength(150);
		expect(result.items.every((g) => g.DeletedAt === null)).toBe(true);
	});

	it("does not revive deleted game with older SourceUpdatedAt", async () => {
		// Arrange
		const game: Game = {
			...root.factories.game.build(),
			DeletedAt: faker.date.recent(),
			SourceUpdatedAt: faker.date.future(),
		};

		await api.GameLibrary.Command.SyncGames.executeAsync({ games: game });

		// Act
		await api.GameLibrary.Command.SyncGames.executeAsync({
			games: {
				...game,
				DeletedAt: null,
				SourceUpdatedAt: faker.date.past(),
			},
		});

		const result = await api.GameLibrary.Query.GetGames.executeAsync({
			limit: 10,
			sort: "recent",
		});

		// Assert
		expect(result.items).toHaveLength(0);
	});

	it("does not delete games missing from sync payload", async () => {
		// Arrange
		const games = root.factories.game.buildList(10);
		await api.GameLibrary.Command.SyncGames.executeAsync({ games });

		// Act
		await api.GameLibrary.Command.SyncGames.executeAsync({
			games: games[0],
		});

		const result = await api.GameLibrary.Query.GetGames.executeAsync({
			limit: 20,
			sort: "recent",
		});

		// Assert
		expect(result.items).toHaveLength(10);
	});
});
