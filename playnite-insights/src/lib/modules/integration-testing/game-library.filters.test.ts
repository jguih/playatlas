import "fake-indexeddb/auto";
import type { ClientApiV1 } from "../bootstrap/application";
import { TestCompositionRoot } from "../bootstrap/testing";
import { CreateGameLibraryFilterCommandHandler } from "../game-library/commands";

describe("Game Library / Game Library Filters", () => {
	let root: TestCompositionRoot;
	let api: ClientApiV1;
	const MAX_FILTERS = CreateGameLibraryFilterCommandHandler.MAX_FILTERS;

	const getFiltersAsync = async () =>
		await api.GameLibrary.Query.GetGameLibraryFilters.executeAsync({
			sort: "recentlyUsed",
			sortOrder: "desc",
		});

	beforeEach(async () => {
		root = new TestCompositionRoot();
		api = await root.buildAsync();
		vi.resetAllMocks();
	});

	afterEach(async () => {
		await root.cleanup();
	});

	it("creates and persists a new filter", async () => {
		// Arrange
		const query = root.factories.gameLibraryFilterQuery.build();

		// Act
		await api.GameLibrary.Command.CreateGameLibraryFilter.executeAsync({ query });
		const { gameLibraryFilters } = await getFiltersAsync();

		// Assert
		expect(gameLibraryFilters).toHaveLength(1);
	});

	it("does not create a duplicate filter for the same query", async () => {
		// Arrange
		const query = root.factories.gameLibraryFilterQuery.build();

		// Act
		await api.GameLibrary.Command.CreateGameLibraryFilter.executeAsync({
			query,
		});

		await api.GameLibrary.Command.CreateGameLibraryFilter.executeAsync({
			query,
		});

		const { gameLibraryFilters } = await getFiltersAsync();

		// Assert
		expect(gameLibraryFilters).toHaveLength(1);
		expect(gameLibraryFilters[0].UseCount).toBe(1);
	});

	it("updates LastUsedAt when an existing filter is reused", async () => {
		// Arrange
		const queries = root.factories.gameLibraryFilterQuery.buildUniqueList(2);
		const first = queries.at(0)!;
		const second = queries.at(1)!;

		await api.GameLibrary.Command.CreateGameLibraryFilter.executeAsync({ query: first });
		await api.GameLibrary.Command.CreateGameLibraryFilter.executeAsync({ query: second });

		// Act
		await api.GameLibrary.Command.CreateGameLibraryFilter.executeAsync({ query: first });

		const { gameLibraryFilters } = await getFiltersAsync();

		// Assert
		expect(gameLibraryFilters).toHaveLength(2);
		expect(gameLibraryFilters[0].Query).toMatchObject(first);
		expect(gameLibraryFilters[1].Query).toMatchObject(second);
	});

	it.each([{ n: 1 }, { n: 2 }, { n: 101 }])(
		"evicts least recently used filters when exceeding max limit by $n",
		async ({ n }) => {
			// Arrange
			const queries = root.factories.gameLibraryFilterQuery.buildUniqueList(MAX_FILTERS + n);

			for (const query of queries) {
				await api.GameLibrary.Command.CreateGameLibraryFilter.executeAsync({
					query,
				});
			}

			// Act
			const { gameLibraryFilters } = await getFiltersAsync();

			// Assert
			expect(gameLibraryFilters).toHaveLength(100);
		},
	);

	it.only("does not evict filters that were recently reused", async () => {
		// Arrange
		const totalFilters = 100;
		const overflow = 5;
		const queries = root.factories.gameLibraryFilterQuery.buildUniqueList(totalFilters + overflow);

		root.clock.setCurrent(new Date("2026-02-03"));
		const oldestQueries = queries.slice(0, 5);
		for (const query of oldestQueries) {
			await api.GameLibrary.Command.CreateGameLibraryFilter.executeAsync({ query });
		}

		root.clock.setCurrent(new Date("2026-02-04"));
		const initialQueries = queries.slice(5, totalFilters);
		for (const query of initialQueries) {
			await api.GameLibrary.Command.CreateGameLibraryFilter.executeAsync({ query });
		}

		root.clock.advance(10_000);

		const recentlyUsed = [initialQueries[0], initialQueries[5], initialQueries[10]];
		for (const query of recentlyUsed) {
			// To bump up lastUsedAt
			await api.GameLibrary.Command.CreateGameLibraryFilter.executeAsync({ query });
		}

		const extraQueries = queries.slice(totalFilters);
		for (const query of extraQueries) {
			await api.GameLibrary.Command.CreateGameLibraryFilter.executeAsync({ query });
		}

		// Act
		const { gameLibraryFilters } = await getFiltersAsync();
		const addedFiltersSearch = gameLibraryFilters.map((f) => f.Query.Filter?.search);

		// Assert
		expect(gameLibraryFilters).toHaveLength(MAX_FILTERS);

		// Note: the factory guarantees the search value to be unique
		expect(recentlyUsed.every((q) => addedFiltersSearch.includes(q.Filter?.search))).toBe(true);
		expect(oldestQueries.every((q) => !addedFiltersSearch.includes(q.Filter?.search))).toBe(true);
	});
});
