import "fake-indexeddb/auto";
import type { ClientApiV1 } from "../bootstrap/application";
import { TestCompositionRoot } from "../bootstrap/testing";

describe("GameLibrary / Completion Statuses", () => {
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

	it("persists and retrieves big list of completion statuses", async () => {
		// Arrange
		const completionStatuses = root.factories.completionStatus.buildList(2000);
		const completionStatusesIds = completionStatuses.map((g) => g.Id);

		await api.GameLibrary.Command.UpsertCompletionStatuses.executeAsync({ completionStatuses });

		// Act
		const result = await api.GameLibrary.Query.GetCompletionStatusesByIds.executeAsync({
			completionStatusesIds,
		});

		expect(result.completionStatuses).toHaveLength(2000);
		expect(result.completionStatuses.map((g) => g.Id)).toEqual(completionStatusesIds);
	});

	it("sync is idempotent", async () => {
		// Arrange
		const completionStatuses = root.factories.completionStatus.buildList(50);
		const completionStatusesIds = completionStatuses.map((g) => g.Id);

		// Act
		await api.GameLibrary.Command.UpsertCompletionStatuses.executeAsync({ completionStatuses });
		await api.GameLibrary.Command.UpsertCompletionStatuses.executeAsync({ completionStatuses });

		const result = await api.GameLibrary.Query.GetCompletionStatusesByIds.executeAsync({
			completionStatusesIds,
		});

		// Assert
		expect(result.completionStatuses).toHaveLength(50);
	});

	it("returns empty result when no completion statuses exist", async () => {
		const result = await api.GameLibrary.Query.GetCompletionStatusesByIds.executeAsync({
			completionStatusesIds: [],
		});
		expect(result.completionStatuses).toHaveLength(0);
	});
});
