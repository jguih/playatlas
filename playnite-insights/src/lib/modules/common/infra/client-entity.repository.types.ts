export type IndexedDbSignal = { db: IDBDatabase | null; dbReady: Promise<void> | null };

export type ClientRepositoryStoreName = 'games' | 'genres';
