import type { ILogServicePort } from '$lib/modules/common/application';
import {
	INDEXEDDB_CURRENT_VERSION,
	INDEXEDDB_NAME,
	type IIndexedDbSchema,
} from '$lib/modules/common/infra';
import type { IClientInfraModulePort, IndexedDbSignal } from './infra.module.port';

export type ClientInfraModuleDeps = {
	logService: ILogServicePort;
	schemas: IIndexedDbSchema[];
};

export class ClientInfraModule implements IClientInfraModulePort {
	readonly indexedDbSignal: IndexedDbSignal;
	private logService: ILogServicePort;
	private schemas: IIndexedDbSchema[];

	constructor({ logService, schemas }: ClientInfraModuleDeps) {
		this.logService = logService;
		this.schemas = schemas;

		this.indexedDbSignal = $state({
			db: null,
			dbReady: Promise.resolve(),
		});
	}

	private openIndexedDbAsync = (props: {
		dbName: string;
		version: number;
		schemas: IIndexedDbSchema[];
	}): Promise<IDBDatabase> => {
		const { dbName, version, schemas } = props;
		return new Promise((resolve, reject) => {
			const request = indexedDB.open(dbName, version);

			request.onerror = () => reject(request.error);
			request.onsuccess = () => {
				const db = request.result;

				db.onversionchange = () => {
					db.close();
					this.logService.warning('Database is outdated, please reload the app');
				};

				resolve(request.result);
			};
			request.onupgradeneeded = (event) => {
				const db = request.result;
				const tx = request.transaction!;
				const oldVersion = event.oldVersion;
				const newVersion = event.newVersion;

				for (const schema of schemas) {
					schema.define({ db, tx, oldVersion, newVersion });
				}
			};
		});
	};

	public initialize = () => {
		this.indexedDbSignal.dbReady = this.openIndexedDbAsync({
			dbName: INDEXEDDB_NAME,
			version: INDEXEDDB_CURRENT_VERSION,
			schemas: this.schemas,
		}).then((db) => {
			this.indexedDbSignal.db = db;
		});
	};
}
