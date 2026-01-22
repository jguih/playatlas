import type { IClockPort } from "$lib/modules/common/application";

export interface IClientInfraModulePort {
	initializeAsync: () => Promise<void>;
	get dbSignal(): IDBDatabase;
	get clock(): IClockPort;
}
