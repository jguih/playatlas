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
			sort: { type: "recentlyUpdated" },
		});

		// Assert
		expect(items).toHaveLength(200);
		for (let i = 1; i < items.length; i++) {
			expect(items[i - 1].SourceLastUpdatedAt >= items[i].SourceLastUpdatedAt).toBe(true);
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
			sort: { type: "recentlyUpdated" },
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
			Playnite: g.Playnite
				? {
						...g.Playnite,
						Name: `${g.Playnite?.Name} (updated)`,
					}
				: null,
			SourceLastUpdatedAt: now,
		}));

		// Act
		await api.GameLibrary.Command.SyncGames.executeAsync({ games: updated });

		const result = await api.GameLibrary.Query.GetGames.executeAsync({
			limit: 10,
			sort: { type: "recentlyUpdated" },
		});

		// Assert
		expect(result.items[0].Playnite?.Name).toContain("(updated)");
	});

	it("returns empty result when no games exist", async () => {
		const result = await api.GameLibrary.Query.GetGames.executeAsync({
			limit: 10,
			sort: { type: "recentlyUpdated" },
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
			sort: { type: "recentlyUpdated" },
		});

		// Assert
		expect(result.items).toHaveLength(1000);
	});

	it("does not overwrite newer local data with older server data", async () => {
		// Arrange
		const game: Game = {
			...root.factories.game.build(),
			SourceLastUpdatedAt: new Date("2026-01-02"),
		};
		await api.GameLibrary.Command.SyncGames.executeAsync({ games: game });

		// Act
		await api.GameLibrary.Command.SyncGames.executeAsync({
			games: {
				...game,
				Playnite: game.Playnite
					? {
							...game.Playnite,
							Name: "Old name",
						}
					: null,
				SourceLastUpdatedAt: new Date("2026-01-01"),
			},
		});
		const stored = await api.GameLibrary.Query.GetGames.executeAsync({
			limit: 1,
			sort: { type: "recentlyUpdated" },
		});

		// Assert
		expect(stored.items[0].Playnite?.Name).toBe(game.Playnite?.Name);
	});

	it("revives a deleted game when server clears DeletedAt", async () => {
		// Arrange
		const game: Game = { ...root.factories.game.build(), DeletedAt: faker.date.recent() };

		await api.GameLibrary.Command.SyncGames.executeAsync({ games: game });

		await api.GameLibrary.Command.SyncGames.executeAsync({
			games: {
				...game,
				DeletedAt: null,
				SourceLastUpdatedAt: faker.date.future(),
			},
		});

		// Act
		const result = await api.GameLibrary.Query.GetGames.executeAsync({
			limit: 100,
			sort: { type: "recentlyUpdated" },
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
			sort: { type: "recentlyUpdated" },
		});

		// Assert
		expect(result.items).toHaveLength(150);
		expect(result.items.every((g) => g.DeletedAt === null)).toBe(true);
	});

	it("does not revive deleted game with older SourceLastUpdatedAt", async () => {
		// Arrange
		const game: Game = {
			...root.factories.game.build(),
			DeletedAt: faker.date.recent(),
			SourceLastUpdatedAt: faker.date.future(),
		};

		await api.GameLibrary.Command.SyncGames.executeAsync({ games: game });

		// Act
		await api.GameLibrary.Command.SyncGames.executeAsync({
			games: {
				...game,
				DeletedAt: null,
				SourceLastUpdatedAt: faker.date.past(),
			},
		});

		const result = await api.GameLibrary.Query.GetGames.executeAsync({
			limit: 10,
			sort: { type: "recentlyUpdated" },
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
			sort: { type: "recentlyUpdated" },
		});

		// Assert
		expect(result.items).toHaveLength(10);
	});

	it("filters games by name while preserving recent ordering", async () => {
		// Arrange
		const baseGames = root.factories.game
			.buildList(20)
			// Makes sure no other game is named Grim something, probably impossible, but better safe than another failed test
			.map((g) => ({ ...g, Playnite: { ...g.Playnite!, Name: "Another Game" } }));

		const oldUpdatedAt = new Date("2025-01-01");
		const matchingOld: Game = {
			...root.factories.game.build(),
			Playnite: {
				...root.factories.game.build().Playnite!,
				Name: "Grim Dawn",
			},
			SourceLastUpdatedAt: oldUpdatedAt,
		};

		const newUpdatedAt = new Date("2026-01-01");
		const matchingNew: Game = {
			...root.factories.game.build(),
			Playnite: {
				...root.factories.game.build().Playnite!,
				Name: "Grim Dawn Definitive Edition",
			},
			SourceLastUpdatedAt: newUpdatedAt,
		};

		await api.GameLibrary.Command.SyncGames.executeAsync({
			games: [...baseGames, matchingOld, matchingNew],
		});

		// Act
		const result = await api.GameLibrary.Query.GetGames.executeAsync({
			limit: 10,
			sort: { type: "recentlyUpdated" },
			filter: { search: "Grim" },
		});

		// Assert
		expect(result.items).toHaveLength(2);
		expect(result.items[0].Playnite?.Name).toContain("Grim");
		expect(result.items[1].Playnite?.Name).toContain("Grim");

		expect(result.items[0].SourceLastUpdatedAt >= result.items[1].SourceLastUpdatedAt).toBe(true);
	});

	it("continues scanning past full non-matching batches", async () => {
		// Arrange
		const earlyNonMatching = root.factories.game
			.buildList(2000) // Big sample because I paid for 100% of my RAM, so I might as well use it all
			.map((g) => ({ ...g, Playnite: { ...g.Playnite!, Name: "Another Game" } }));

		const lateUpdatedAt = faker.date.past();
		const matchingLate: Game = {
			...root.factories.game.build(),
			Playnite: {
				...root.factories.game.build().Playnite!,
				Name: "Grim Dawn",
			},
			SourceLastUpdatedAt: lateUpdatedAt,
		};

		await api.GameLibrary.Command.SyncGames.executeAsync({
			games: [...earlyNonMatching, matchingLate],
		});

		// Act
		const result = await api.GameLibrary.Query.GetGames.executeAsync({
			limit: 10,
			sort: { type: "recentlyUpdated" },
			filter: { search: "Grim" },
		});

		// Assert
		expect(result.items).toHaveLength(1);
		expect(result.items[0].Playnite?.Name).toBe("Grim Dawn");
	});

	it("find game matching search query in between multiple other games in a big list", async () => {
		// Arrange
		const nonMatching = root.factories.game
			.buildList(2000)
			.map((g) => ({ ...g, Playnite: { ...g.Playnite!, Name: "Another Game" } }));

		const olderUpdatedAt = new Date("2026-01-01");
		const older = nonMatching.slice(0, 1500).map((g) => ({
			...g,
			SourceLastUpdatedAt: olderUpdatedAt,
		}));

		const newerUpdatedAt = new Date("2026-01-03");
		const newer = nonMatching.slice(1500).map((g) => ({
			...g,
			SourceLastUpdatedAt: newerUpdatedAt,
		}));

		const SourceLastUpdatedAt = new Date("2026-01-02");
		const matchingGame: Game = {
			...root.factories.game.build(),
			Playnite: {
				...root.factories.game.build().Playnite!,
				Name: "Grim Dawn",
			},
			SourceLastUpdatedAt: SourceLastUpdatedAt,
		};

		await api.GameLibrary.Command.SyncGames.executeAsync({
			games: [...older, matchingGame, ...newer],
		});

		// Act
		const result = await api.GameLibrary.Query.GetGames.executeAsync({
			limit: 10,
			sort: { type: "recentlyUpdated" },
			filter: { search: "Grim" },
		});

		// Assert
		expect(result.items).toHaveLength(1);
		expect(result.items[0].Playnite?.Name).toBe("Grim Dawn");
	});

	it("order games by recently updated ascending", async () => {
		// Arrange
		const games = root.factories.game.buildList(2000);

		await api.GameLibrary.Command.SyncGames.executeAsync({ games });

		// Act
		const result = await api.GameLibrary.Query.GetGames.executeAsync({
			limit: 50,
			sort: { type: "recentlyUpdated", direction: "asc" },
		});

		// Assert
		expect(
			result.items.every(
				(game, index, arr) =>
					index === 0 || game.SourceLastUpdatedAt >= arr[index - 1].SourceLastUpdatedAt,
			),
		);
	});

	it("order games by recently updated descending", async () => {
		// Arrange
		const games = root.factories.game.buildList(2000);

		await api.GameLibrary.Command.SyncGames.executeAsync({ games });

		// Act
		const result = await api.GameLibrary.Query.GetGames.executeAsync({
			limit: 50,
			sort: { type: "recentlyUpdated", direction: "asc" },
		});

		// Assert
		expect(
			result.items.every(
				(game, index, arr) =>
					index === 0 || game.SourceLastUpdatedAt <= arr[index - 1].SourceLastUpdatedAt,
			),
		);
	});
});
