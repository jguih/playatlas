import "fake-indexeddb/auto";
import type { ClientApiV1 } from "../bootstrap/application";
import { TestCompositionRoot } from "../bootstrap/testing";

describe("GameLibrary / Platforms", () => {
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

	it("persists and retrieves big list of platforms", async () => {
		// Arrange
		const platforms = root.factories.platform.buildList(2000);
		const platformIds = platforms.map((g) => g.Id);

		await api.GameLibrary.Command.SyncPlatforms.executeAsync({ platforms });

		// Act
		const result = await api.GameLibrary.Query.GetPlatformsByIds.executeAsync({
			platformIds,
		});

		expect(result.platforms).toHaveLength(2000);
		expect(result.platforms.map((g) => g.Id)).toEqual(platformIds);
	});
});
