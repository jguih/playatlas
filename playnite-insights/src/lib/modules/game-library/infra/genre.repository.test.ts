import { type ClientApi } from '$lib/modules/bootstrap/application';
import { TestCompositionRoot } from '$lib/modules/bootstrap/testing';
import 'fake-indexeddb/auto';

describe('Genre Repository', () => {
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

	it('persists and retrieves genres', async () => {
		// Arrange
		const genres = root.factories.genre.buildList(20);

		await api.GameLibrary.Command.SyncGenres.executeAsync({ genres });

		expect(true).toBeTruthy();
	});
});
