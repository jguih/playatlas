import type { IPlayAtlasSyncStatePort } from "$lib/modules/common/application/play-atlas-sync-state.port";

export interface IClientInfraModulePort {
	initializeAsync: () => Promise<void>;
	get dbSignal(): IDBDatabase;
	get playAtlasSyncState(): IPlayAtlasSyncStatePort;
}
