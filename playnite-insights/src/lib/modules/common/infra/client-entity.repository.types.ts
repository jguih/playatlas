export type IndexedDbSignal = { db: IDBDatabase | null; dbReady: Promise<void> | null };

export type ClientRepositoryStoreName =
	| "games"
	| "genres"
	| "companies"
	| "platforms"
	| "completion-status"
	| "session-id"
	| "game-library-filters";
