export type IndexedDbSignal = { db: IDBDatabase | null; dbReady: Promise<void> | null };

export type ClientRepositoryStoreName =
	| "games"
	| "genres"
	| "companies"
	| "platforms"
	| "completion-status"
	| "session-id"
	| "game-library-filters"
	| "game-classification"
	| "game-vectors";

export type ClientRepositoryMeta<TLabel extends string, TIndex extends string> = {
	storeName: ClientRepositoryStoreName;
	index: Record<TLabel, TIndex>;
};
