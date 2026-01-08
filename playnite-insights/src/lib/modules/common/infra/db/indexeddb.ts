import { GameRepository } from '$lib/modules/game-library/infra/game.repository';
import { GameNoteRepository } from './gameNotesRepository.svelte';
import { KeyValueRepository } from './keyValueRepository.svelte';
import { SyncQueueRepository } from './syncQueueRepository.svelte';

export const INDEXEDDB_NAME = 'PlayAtlasDb';
export const INDEXEDDB_CURRENT_VERSION = 6;

export const openIndexedDbAsync: (props: {
	dbName: string;
	version: number;
}) => Promise<IDBDatabase> = ({ dbName, version }) => {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(dbName, version);

		request.onerror = () => reject(request.error);
		request.onsuccess = () => {
			const db = request.result;

			db.onversionchange = () => {
				db.close();
				console.warn('Database is outdated, please reload the app');
			};

			resolve(request.result);
		};
		request.onupgradeneeded = (event) => {
			const db = request.result;
			const tx = request.transaction!;
			const oldVersion = event.oldVersion;
			const newVersion = event.newVersion;

			GameNoteRepository.defineSchema({ db, tx, oldVersion, newVersion });
			SyncQueueRepository.defineSchema({ db, tx, oldVersion, newVersion });
			KeyValueRepository.defineSchema({ db, tx, oldVersion, newVersion });
			GameRepository.defineSchema({ db, tx, oldVersion, newVersion });
		};
	});
};

export type StoreNames =
	| typeof SyncQueueRepository.STORE_NAME
	| typeof GameNoteRepository.STORE_NAME
	| typeof KeyValueRepository.STORE_NAME
	| typeof GameRepository.STORE_NAME;
