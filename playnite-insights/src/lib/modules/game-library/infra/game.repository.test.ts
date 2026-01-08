import type { IndexedDbSignal } from '$lib/client/app-state/indexeddbManager.svelte';
import type { IDateTimeHandler } from '$lib/client/utils/dateTimeHandler.svelte';
import {
	INDEXEDDB_CURRENT_VERSION,
	INDEXEDDB_NAME,
	openIndexedDbAsync,
} from '$lib/modules/common/infra/db/indexeddb';
import 'fake-indexeddb/auto';
import { GameRepository } from './game.repository';

const indexedDbSignal: IndexedDbSignal = { db: null, dbReady: null };
const dateTimeHandler: IDateTimeHandler = {
	getUtcNow: () => Date.now(),
};

describe('Game Repository', () => {
	beforeEach(async () => {
		indexedDbSignal.dbReady = openIndexedDbAsync({
			dbName: INDEXEDDB_NAME,
			version: INDEXEDDB_CURRENT_VERSION,
		}).then((db) => {
			db.onversionchange = () => {
				db.close();
			};
			indexedDbSignal.db = db;
		});
		vi.resetAllMocks();
	});

	afterEach(() => {
		indexedDB.deleteDatabase(INDEXEDDB_NAME);
	});

	it('works', () => {
		const repo = new GameRepository({ indexedDbSignal, dateTimeHandler });
		expect(repo).toBeTruthy();
	});
});
