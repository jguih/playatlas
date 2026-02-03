export interface IClientInfraModulePort {
	initializeAsync: () => Promise<void>;
	get dbSignal(): IDBDatabase;
}
