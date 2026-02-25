import { IndexedDbRepository, type IndexedDbRepositoryDeps } from "$lib/modules/common/infra";
import type { GameId } from "@playatlas/common/domain";
import type { GameRecommendationRecordReadModel } from "./game-recommendation-record.readonly-store";
import { gameRecommendationRecordStoreMeta as meta } from "./game-recommendation-record.schema";

export type IGameRecommendationRecordWriteStore = {
	upsertAsync: (record: GameRecommendationRecordReadModel) => Promise<void>;
	deleteAsync: (props: { gameId: GameId }) => Promise<void>;
};

export type GameRecommendationRecordWriteStoreDeps = IndexedDbRepositoryDeps;

export class GameRecommendationRecordWriteStore
	extends IndexedDbRepository
	implements IGameRecommendationRecordWriteStore
{
	constructor(private readonly deps: GameRecommendationRecordWriteStoreDeps) {
		super(deps);
	}

	upsertAsync: IGameRecommendationRecordWriteStore["upsertAsync"] = async (record) => {
		return await this.runTransaction([meta.storeName], "readwrite", async ({ tx }) => {
			const store = tx.objectStore(meta.storeName);
			await this.runRequest(store.put(record));
		});
	};

	deleteAsync: IGameRecommendationRecordWriteStore["deleteAsync"] = async ({ gameId }) => {
		return await this.runTransaction([meta.storeName], "readwrite", async ({ tx }) => {
			const store = tx.objectStore(meta.storeName);
			await this.runRequest(store.delete(gameId));
		});
	};
}
