import type {
	IPlayAtlasSyncManagerPort,
	ISyncProgressReporterPort,
} from "$lib/modules/synchronization/application";

export type ISynchronizationModulePort = {
	get syncManager(): IPlayAtlasSyncManagerPort;
	get syncProgressReporter(): ISyncProgressReporterPort;
};
