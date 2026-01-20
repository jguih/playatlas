import type { IClockPort } from "$lib/modules/common/application";

export type IndexedDbSignal = { db: IDBDatabase | null; dbReady: boolean };

export interface IClientInfraModulePort {
	initializeAsync: () => Promise<void>;
	get dbSignal(): IDBDatabase;
	get clock(): IClockPort;
}
