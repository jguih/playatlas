import { TestCompositionRoot } from '$lib/modules/bootstrap/testing/test-composition-root.svelte';
import 'fake-indexeddb/auto';

describe('Game Repository', () => {
	beforeEach(() => vi.resetAllMocks());

	it('works', () => {
		// Arrange
		const root = new TestCompositionRoot();
		const api = root.build();

		// Assert
		expect(api.GetGamesQueryHandler).toBeTruthy();
	});
});
