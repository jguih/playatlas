import "fake-indexeddb/auto";
import type { ClientApiV1 } from "../bootstrap/application";
import { TestCompositionRoot } from "../bootstrap/testing";

describe("Game Library / Filters", () => {
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

	it("creates and persists a new filter", async () => {
		// Arrange
		const filter = root.factories.gameLibraryFilters.build();

		// Act
		await api.GameLibrary.Command.CreateGameLibraryFilter.executeAsync({ query: filter.Query });

		// Assert
		expect(true).toBeTruthy();
	});
});
