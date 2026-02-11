import type { ClientEntity } from "$lib/modules/common/common";
import type { SyncTarget } from "../domain";

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
