import type { IClockPort } from "$lib/modules/common/application";
import type { ClientEntity } from "$lib/modules/common/common";
import type { IGameLibrarySyncStatePort, SyncTarget } from "./game-library-sync-state.port";

export type SyncRunnerFetchResult<TDto> =
	| { success: false }
	| {
			success: true;
			items: TDto[];
			nextCursor: string;
	  };

export type SyncRunnerConfig<TEntity, TDto> = {
	syncTarget: SyncTarget;
	fetchAsync: (args: { lastCursor: string | null }) => Promise<SyncRunnerFetchResult<TDto>>;
	mapDtoToEntity: (args: { dto: TDto; now: Date }) => TEntity;
	persistAsync: (args: { entities: TEntity[] }) => Promise<void>;
};

export type ISyncRunnerPort = {
	runAsync: <TEntityKey extends IDBValidKey, TEntity extends ClientEntity<TEntityKey>, TDto>(
		config: SyncRunnerConfig<TEntity, TDto>,
	) => Promise<void>;
};

export type SyncRunnerDeps = {
	clock: IClockPort;
	gameLibrarySyncState: IGameLibrarySyncStatePort;
};

export class SyncRunner implements ISyncRunnerPort {
	constructor(private readonly deps: SyncRunnerDeps) {}

	runAsync: ISyncRunnerPort["runAsync"] = async ({
		fetchAsync,
		mapDtoToEntity: map,
		persistAsync,
		syncTarget,
	}) => {
		const { clock, gameLibrarySyncState } = this.deps;

		const now = clock.now();
		const lastCursor = gameLibrarySyncState.getLastServerSyncCursor(syncTarget);

		const response = await fetchAsync({ lastCursor });

		if (!response.success) return;

		const entities = response.items.map((i) => map({ dto: i, now }));

		await persistAsync({ entities });

		gameLibrarySyncState.setLastServerSyncCursor(syncTarget, response.nextCursor);
	};
}
