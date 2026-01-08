import type { IDateTimeHandler } from '$lib/client/utils/dateTimeHandler.svelte';
import {
	gameNoteSchema,
	SyncQueueFactory,
	type GameNote,
	type SyncQueueItem,
} from '@playnite-insights/lib/client';
import type { IGameNotesRepository } from './IGameNotesRepository';
import { IndexedDBRepository, type IndexedDBRepositoryDeps } from './repository.svelte';
import { SyncQueueRepository } from './syncQueueRepository.svelte';

export type GameNoteRepositoryDeps = {
	syncQueueFactory: SyncQueueFactory;
	dateTimeHandler: IDateTimeHandler;
} & IndexedDBRepositoryDeps;

export class GameNoteRepository extends IndexedDBRepository implements IGameNotesRepository {
	#syncQueueFactory: GameNoteRepositoryDeps['syncQueueFactory'];
	#dateTimeHandler: GameNoteRepositoryDeps['dateTimeHandler'];

	static STORE_NAME = 'gameNotes' as const;

	static INDEX = {
		byGameId: 'byGameId',
		bySessionId: 'bySessionId',
	} as const;

	static FILTER_BY = {
		Id: 'Id',
		byGameId: this.INDEX.byGameId,
	} as const;

	constructor({ indexedDbSignal, syncQueueFactory, dateTimeHandler }: GameNoteRepositoryDeps) {
		super({ indexedDbSignal });
		this.#syncQueueFactory = syncQueueFactory;
		this.#dateTimeHandler = dateTimeHandler;
	}

	addAsync: IGameNotesRepository['addAsync'] = async ({ note }) => {
		const parseResult = gameNoteSchema.safeParse(note);
		if (!parseResult.success) return null;

		const key = await this.runTransaction(
			['gameNotes', 'syncQueue'],
			'readwrite',
			async ({ tx }) => {
				const notesStore = tx.objectStore(GameNoteRepository.STORE_NAME);
				const syncQueueStore = tx.objectStore(SyncQueueRepository.STORE_NAME);
				const key = await this.runRequest(notesStore.add(note));
				const queueItem = this.#syncQueueFactory.create({ Entity: 'gameNote', Payload: note });
				await this.runRequest(syncQueueStore.add(queueItem));
				return key;
			},
		);
		return key as string;
	};

	putAsync: IGameNotesRepository['putAsync'] = async ({ note }) => {
		const parseResult = gameNoteSchema.safeParse(note);
		if (!parseResult.success) return false;
		const now = new Date(this.#dateTimeHandler.getUtcNow()).toISOString();

		return await this.runTransaction(['gameNotes', 'syncQueue'], 'readwrite', async ({ tx }) => {
			const notesStore = tx.objectStore(GameNoteRepository.STORE_NAME);
			const syncQueueStore = tx.objectStore(SyncQueueRepository.STORE_NAME);

			const existingNote = await this.runRequest<GameNote | undefined>(notesStore.get(note.Id));
			const index = syncQueueStore.index(SyncQueueRepository.INDEX.Entity_PayloadId_Status_Type);
			const existingQueueItem = await this.runRequest<SyncQueueItem | undefined>(
				index.get(['gameNote', note.Id, 'pending', 'update']),
			);

			note.LastUpdatedAt = now;
			await this.runRequest(notesStore.put(note));

			if (!existingNote) {
				const queueItem = this.#syncQueueFactory.create({
					Entity: 'gameNote',
					Payload: note,
					Type: 'create',
				});
				await this.runRequest(syncQueueStore.add(queueItem));
				return true;
			}

			if (existingQueueItem) {
				existingQueueItem.Payload = note;
				await this.runRequest(syncQueueStore.put(existingQueueItem));
			} else {
				const queueItem = this.#syncQueueFactory.create({
					Entity: 'gameNote',
					Payload: note,
					Type: 'update',
				});
				await this.runRequest(syncQueueStore.add(queueItem));
			}

			return true;
		});
	};

	deleteAsync: IGameNotesRepository['deleteAsync'] = async (props) => {
		const now = new Date(this.#dateTimeHandler.getUtcNow()).toISOString();

		return await this.runTransaction(['gameNotes', 'syncQueue'], 'readwrite', async ({ tx }) => {
			const notesStore = tx.objectStore(GameNoteRepository.STORE_NAME);
			const syncQueueStore = tx.objectStore(SyncQueueRepository.STORE_NAME);
			const existingNote = await this.runRequest<GameNote | undefined>(
				notesStore.get(props.noteId),
			);

			if (!existingNote) return false;
			if (existingNote.DeletedAt) return true;
			existingNote.DeletedAt = now;
			await this.runRequest(notesStore.put(existingNote));

			const queueItem = this.#syncQueueFactory.create({
				Entity: 'gameNote',
				Payload: existingNote,
				Type: 'delete',
			});
			await this.runRequest(syncQueueStore.add(queueItem));

			return true;
		});
	};

	getAsync: IGameNotesRepository['getAsync'] = async (props) => {
		return await this.runTransaction('gameNotes', 'readonly', async ({ tx }) => {
			const notesStore = tx.objectStore(GameNoteRepository.STORE_NAME);

			switch (props.filterBy) {
				case 'Id': {
					const note = await this.runRequest<GameNote | undefined>(notesStore.get(props.Id));
					if (note && note.DeletedAt === null) return note;
					return null;
				}
				default:
					return null;
			}
		});
	};

	getAllAsync: IGameNotesRepository['getAllAsync'] = async (props = {}) => {
		return await this.runTransaction('gameNotes', 'readonly', async ({ tx }) => {
			const notesStore = tx.objectStore(GameNoteRepository.STORE_NAME);
			let notes: GameNote[] = [];

			switch (props.filterBy) {
				case 'byGameId': {
					const index = notesStore.index(GameNoteRepository.INDEX.byGameId);
					notes = await this.runRequest<GameNote[]>(index.getAll(props.GameId));
					break;
				}
				default:
					notes = await this.runRequest<GameNote[]>(notesStore.getAll());
					break;
			}

			return notes
				.sort((a, b) => {
					if (b.CreatedAt === a.CreatedAt) return 0;
					if (a.CreatedAt < b.CreatedAt) return 1;
					return -1;
				})
				.filter((n) => n.DeletedAt === null);
		});
	};

	upsertOrDeleteManyAsync: IGameNotesRepository['upsertOrDeleteManyAsync'] = async (notes, ops) => {
		const shouldOverride = ops?.override === true;
		if (notes.length === 0) return;
		return await this.runTransaction(
			[GameNoteRepository.STORE_NAME],
			'readwrite',
			async ({ tx }) => {
				const store = tx.objectStore(GameNoteRepository.STORE_NAME);
				for (const note of notes) {
					const existing = await this.runRequest<GameNote | undefined>(store.get(note.Id));
					if (
						shouldOverride ||
						!existing ||
						new Date(note.LastUpdatedAt) > new Date(existing.LastUpdatedAt)
					) {
						await this.runRequest(store.put(note));
					}
				}
			},
		);
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
			const store = db.createObjectStore(this.STORE_NAME, { keyPath: 'Id' });
			store.createIndex(this.INDEX.byGameId, 'GameId', { unique: false });
			store.createIndex(this.INDEX.bySessionId, 'SessionId', { unique: false });
		}

		// Future migrations
	};
}
