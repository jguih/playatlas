import type { ClientApi } from '$lib/modules/bootstrap/application';
import { TestCompositionRoot } from '$lib/modules/bootstrap/testing';
import 'fake-indexeddb/auto';

describe('Game Repository', () => {
	let root: TestCompositionRoot;
	let api: ClientApi;

	beforeEach(() => {
		root = new TestCompositionRoot();
		api = root.build();
		vi.resetAllMocks();
	});

	afterEach(async () => {
		await root.cleanup();
	});

	it('works', async () => {
		// Arrange

		// Act
		const result = await api.GetGamesQueryHandler.executeAsync({ limit: 1, sort: 'recent' });

		// Assert
		expect(result.items).toHaveLength(0);
	});
});
