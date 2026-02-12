import type { ClientApiV1 } from "$lib/modules/bootstrap/application";
import { TestCompositionRoot } from "$lib/modules/bootstrap/testing";
import { GAME_CLASSIFICATION_DIMENSIONS } from "$lib/modules/common/domain";
import "fake-indexeddb/auto";

describe("Game Library / Recommendation Engine Game Vectors", () => {
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

	it("project game vectors from game classifications", async () => {
		// Arrange
		const gameClassifications = root.factories.gameClassification.buildList(2000);

		await api.GameLibrary.RecommendationEngine.Command.ProjectGameVectors.executeAsync({
			gameClassifications,
		});

		// Act
		const result = await api.GameLibrary.RecommendationEngine.Query.GetGameVectors.executeAsync();

		// Assert
		expect(result.gameVectors).toHaveLength(2000);

		for (const [, v] of result.gameVectors) {
			expect(v.length).toBe(GAME_CLASSIFICATION_DIMENSIONS);
		}

		for (const [, v] of result.gameVectors) {
			for (const x of v) {
				expect(x).toBeGreaterThanOrEqual(0);
				expect(x).toBeLessThanOrEqual(1);
			}
		}
	});
});
