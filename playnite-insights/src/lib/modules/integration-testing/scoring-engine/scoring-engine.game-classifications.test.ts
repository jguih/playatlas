import type { ClientApiV1 } from "$lib/modules/bootstrap/application";
import { TestCompositionRoot } from "$lib/modules/bootstrap/testing";
import { GameIdParser } from "$lib/modules/common/domain";
import { faker } from "@faker-js/faker";
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
		const gameClassifications = root.factories.gameClassification.buildList(20_000);
		const gameClassificationIds = gameClassifications.map((gc) => gc.Id);

		await api.GameLibrary.ScoringEngine.Command.UpsertGameClassifications.executeAsync({
			gameClassifications,
		});

		// Act
		const result = await api.GameLibrary.ScoringEngine.Query.GetGameClassifications.executeAsync({
			gameClassificationIds,
		});

		// Assert
		expect(result.gameClassifications).toHaveLength(20_000);
		expect(new Set(result.gameClassifications.map((gc) => gc.Id))).toEqual(
			new Set(gameClassificationIds),
		);
	});

	it("returns game classifications ordered from oldest to newest", async () => {
		// Arrange
		const gameId = GameIdParser.fromTrusted(faker.string.ulid());
		const gameClassifications = root.factories.gameClassification
			.buildList(1_000)
			.map((gc) => ({ ...gc, GameId: gameId }));

		await api.GameLibrary.ScoringEngine.Command.UpsertGameClassifications.executeAsync({
			gameClassifications,
		});

		// Act
		const result =
			await api.GameLibrary.ScoringEngine.Query.GetGameClassificationsByGameId.executeAsync({
				gameId,
			});

		// Assert
		expect(result.gameClassifications).not.toBe(null);

		for (const [, gameClassificationsSet] of result.gameClassifications!) {
			const gameClassifications = gameClassificationsSet.values().toArray();

			for (let i = 1; i < gameClassifications.length; i++) {
				expect(gameClassifications[i - 1].SourceLastUpdatedAt.getTime()).toBeLessThanOrEqual(
					gameClassifications[i].SourceLastUpdatedAt.getTime(),
				);
			}
		}
	});
});
