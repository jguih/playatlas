import 'fake-indexeddb/auto';
import type { ClientApi } from '../bootstrap/application';
import { TestCompositionRoot } from '../bootstrap/testing';

describe('GameLibrary / Genres (integration)', () => {
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

	it('persists and retrieves big list of companies', async () => {
		// Arrange
		const companies = root.factories.company.buildList(2000);
		const companyIds = companies.map((g) => g.Id);

		await api.GameLibrary.Command.SyncCompanies.executeAsync({ companies });

		// Act
		const result = await api.GameLibrary.Query.GetCompaniesByIds.executeAsync({ companyIds });

		expect(result.companies).toHaveLength(2000);
		expect(result.companies.map((g) => g.Id)).toEqual(companyIds);
	});
});
