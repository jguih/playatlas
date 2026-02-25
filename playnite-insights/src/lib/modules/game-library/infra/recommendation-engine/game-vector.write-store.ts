import type { GameId } from "$lib/modules/common/domain";
import { IndexedDbRepository, type IndexedDbRepositoryDeps } from "$lib/modules/common/infra";
import type { ClassificationId } from "@playatlas/common/domain";
import type { GameVectorReadModel } from "./game-vector.readonly-store";
import { gameVectorStoreMeta } from "./game-vector.store.schema";

export type IGameVectorWriteStore = {
	upsertAsync: (props: {
		gameId: GameId;
		classificationId: ClassificationId;
		normalizedScore: number;
	}) => Promise<void>;
	deleteAsync: (props: { gameId: GameId; classificationId: ClassificationId }) => Promise<void>;
};

export type GameVectorWriteStoreDeps = IndexedDbRepositoryDeps;

export class GameVectorWriteStore extends IndexedDbRepository implements IGameVectorWriteStore {
	private readonly meta = gameVectorStoreMeta;

	constructor(private readonly deps: GameVectorWriteStoreDeps) {
		super(deps);
	}

	upsertAsync: IGameVectorWriteStore["upsertAsync"] = async ({
		gameId,
		classificationId,
		normalizedScore,
	}) => {
		return await this.runTransaction([this.meta.storeName], "readwrite", async ({ tx }) => {
			const store = tx.objectStore(this.meta.storeName);

			const model: GameVectorReadModel = {
				GameId: gameId,
				ClassificationId: classificationId,
				NormalizedScore: normalizedScore,
			};

			await this.runRequest(store.put(model));
		});
	};

	deleteAsync: IGameVectorWriteStore["deleteAsync"] = async ({ gameId, classificationId }) => {
		return await this.runTransaction([this.meta.storeName], "readwrite", async ({ tx }) => {
			const store = tx.objectStore(this.meta.storeName);
			await this.runRequest(store.delete([gameId, classificationId]));
		});
	};
}
