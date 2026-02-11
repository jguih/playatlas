import type { IGameLibrarySyncStatePort } from "$lib/modules/common/application/game-library-sync-state.port";

export interface IClientInfraModulePort {
	initializeAsync: () => Promise<void>;
	get dbSignal(): IDBDatabase;
	get gameLibrarySyncState(): IGameLibrarySyncStatePort;
}
