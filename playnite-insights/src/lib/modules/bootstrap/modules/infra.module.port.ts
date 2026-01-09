export type IndexedDbSignal = { db: IDBDatabase | null; dbReady: Promise<void> | null };

export interface IClientInfraModulePort {
	get indexedDbSignal(): IndexedDbSignal;
	initialize: () => void;
}
