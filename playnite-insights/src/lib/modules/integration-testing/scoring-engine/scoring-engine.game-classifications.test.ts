import type { ClientApiV1 } from "$lib/modules/bootstrap/application";
import { TestCompositionRoot } from "$lib/modules/bootstrap/testing";
import "fake-indexeddb/auto";

describe("Game Library / Scoring Engine Game Classifications", () => {
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

	it("persists and retrieves big list of game classifications", async () => {
		// Arrange
		const gameClassifications = root.factories.gameClassification.buildList(2000);
		const gameClassificationIds = gameClassifications.map((gc) => gc.Id);

		await api.GameLibrary.ScoringEngine.Command.SyncGameClassifications.executeAsync({
			gameClassifications,
		});

		// Act
		const result = await api.GameLibrary.ScoringEngine.Query.GetGameClassifications.executeAsync({
			gameClassificationIds,
		});

		// Assert
		expect(result.gameClassifications).toHaveLength(2000);
		expect(result.gameClassifications.map((gc) => gc.Id)).toEqual(gameClassificationIds);
	});
});
