import type { IPlayAtlasSyncStatePort } from "$lib/modules/common/application";
import type {
	IGameRecommendationRecordReadonlyStore,
	IGameRecommendationRecordWriteStore,
	IGameVectorReadonlyStore,
	IGameVectorWriteStore,
} from "$lib/modules/game-library/infra";

export interface IClientInfraModulePort {
	initializeAsync: () => Promise<void>;
	get dbSignal(): IDBDatabase;
	get playAtlasSyncState(): IPlayAtlasSyncStatePort;

	get gameVectorWriteStore(): IGameVectorWriteStore;
	get gameVectorReadonlyStore(): IGameVectorReadonlyStore;
	get gameRecommendationRecordWriteStore(): IGameRecommendationRecordWriteStore;
	get gameRecommendationRecordReadonlyStore(): IGameRecommendationRecordReadonlyStore;
}
