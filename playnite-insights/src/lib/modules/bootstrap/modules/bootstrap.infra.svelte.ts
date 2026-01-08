import {
	INDEXEDDB_CURRENT_VERSION,
	INDEXEDDB_NAME,
	openIndexedDbAsync,
} from '$lib/modules/common/infra/db/indexeddb';
import type { IClientInfraModulePort, IndexedDbSignal } from './bootstrap.infra.types';

export class ClientInfraModule implements IClientInfraModulePort {
	readonly indexedDbSignal: IndexedDbSignal;

	constructor() {
		this.indexedDbSignal = $state({
			db: null,
			dbReady: Promise.resolve(),
		});

		this.indexedDbSignal.dbReady = openIndexedDbAsync({
			dbName: INDEXEDDB_NAME,
			version: INDEXEDDB_CURRENT_VERSION,
		}).then((db) => {
			this.indexedDbSignal.db = db;
		});
	}
}
