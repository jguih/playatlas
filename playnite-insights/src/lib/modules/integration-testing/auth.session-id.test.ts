import { faker } from "@faker-js/faker";
import "fake-indexeddb/auto";
import type { ClientApi } from "../bootstrap/application";
import { TestCompositionRoot } from "../bootstrap/testing";

describe("Auth / Session Id", () => {
	let root: TestCompositionRoot;
	let api: ClientApi;

	beforeEach(async () => {
		root = new TestCompositionRoot();
		api = await root.buildAsync();
		vi.resetAllMocks();
	});

	afterEach(async () => {
		await root.cleanup();
	});

	it("persists and retrieves session it", async () => {
		// Arrange
		const sessionId = faker.string.uuid();

		// Act
		await api.Auth.SessionIdProvider.setAsync(sessionId);
		const addedSessionId = await api.Auth.SessionIdProvider.getAsync();

		// Assert
		expect(addedSessionId).toBe(sessionId);
	});

	it("load session id", async () => {
		// Arrange
		const sessionId = faker.string.uuid();

		// Act
		await api.Auth.SessionIdProvider.setAsync(sessionId);
		await api.Auth.SessionIdProvider.loadFromDbAsync();
		const addedSessionId = await api.Auth.SessionIdProvider.getAsync();

		// Assert
		expect(addedSessionId).toBe(sessionId);
	});
});
