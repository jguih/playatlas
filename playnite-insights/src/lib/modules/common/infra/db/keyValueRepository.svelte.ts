import type { KeyValue, KeyValueMap } from '@playnite-insights/lib/client';
import type { IKeyValueRepository } from './IKeyValueRepository';
import { IndexedDBRepository, type IndexedDBRepositoryDeps } from './repository.svelte';

export type KeyValueRepositoryDeps = IndexedDBRepositoryDeps;

export class KeyValueRepository extends IndexedDBRepository implements IKeyValueRepository {
	static STORE_NAME = 'keyValue' as const;

	constructor({ indexedDbSignal }: KeyValueRepositoryDeps) {
		super({ indexedDbSignal });
	}

	putAsync: IKeyValueRepository['putAsync'] = async ({ keyvalue }) => {
		return await this.runTransaction('keyValue', 'readwrite', async ({ tx }) => {
			const keyvalueStore = tx.objectStore(KeyValueRepository.STORE_NAME);
			await this.runRequest(keyvalueStore.put(keyvalue));
		});
	};

	deleteAsync: IKeyValueRepository['deleteAsync'] = async ({ key }) => {
		return await this.runTransaction('keyValue', 'readwrite', async ({ tx }) => {
			const keyvalueStore = tx.objectStore(KeyValueRepository.STORE_NAME);
			await this.runRequest(keyvalueStore.delete(key));
		});
	};

	getAsync: IKeyValueRepository['getAsync'] = async <K extends keyof KeyValueMap>({
		key,
	}: {
		key: K;
	}) => {
		return await this.runTransaction('keyValue', 'readonly', async ({ tx }) => {
			const keyvalueStore = tx.objectStore(KeyValueRepository.STORE_NAME);
			const keyvalue = await this.runRequest<KeyValue | undefined>(keyvalueStore.get(key));
			return (keyvalue?.Value as KeyValueMap[K]) ?? null;
		});
	};

	static defineSchema = ({
		db,
	}: {
		db: IDBDatabase;
		tx: IDBTransaction;
		oldVersion: number;
		newVersion: number | null;
	}): void => {
		if (!db.objectStoreNames.contains(this.STORE_NAME)) {
			db.createObjectStore(this.STORE_NAME, { keyPath: 'Key' });
		}

		// Future migrations
	};
}
