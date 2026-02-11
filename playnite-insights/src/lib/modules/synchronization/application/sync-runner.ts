import type {
	IClockPort,
	IPlayAtlasSyncStatePort,
	ISyncRunnerPort,
} from "$lib/modules/common/application";

export type SyncRunnerDeps = {
	clock: IClockPort;
	syncState: IPlayAtlasSyncStatePort;
};

export class SyncRunner implements ISyncRunnerPort {
	constructor(private readonly deps: SyncRunnerDeps) {}

	runAsync: ISyncRunnerPort["runAsync"] = async ({
		fetchAsync,
		mapDtoToEntity: map,
		persistAsync,
		syncTarget,
	}) => {
		const { clock, syncState } = this.deps;

		const now = clock.now();
		const lastCursor = syncState.getLastServerSyncCursor(syncTarget);

		const response = await fetchAsync({ lastCursor });

		if (!response.success) return;

		const entities = response.items.map((i) => map({ dto: i, now }));

		await persistAsync({ entities });

		syncState.setLastServerSyncCursor(syncTarget, response.nextCursor);
	};
}
