import type { ClientRepositoryMeta, IIndexedDbSchema } from "$lib/modules/common/infra";
import type { GameVectorReadModel } from "./game-vector.readonly-store";

export const gameVectorStoreMeta = {
	storeName: "game-vectors",
	index: {
		BY_GAME_ID: "byGameId",
	},
} as const satisfies ClientRepositoryMeta<string, string>;

export type GameVectorStoreIndex =
	(typeof gameVectorStoreMeta.index)[keyof typeof gameVectorStoreMeta.index];

const createIndex = (
	store: IDBObjectStore,
	name: GameVectorStoreIndex,
	keyPath: (keyof GameVectorReadModel)[] | keyof GameVectorReadModel,
	options?: IDBIndexParameters,
) => store.createIndex(name, keyPath, options);

export const gameVectorStoreSchema: IIndexedDbSchema = {
	define: ({ db }) => {
		const { storeName, index } = gameVectorStoreMeta;

		if (!db.objectStoreNames.contains(storeName)) {
			const keyPath: (keyof GameVectorReadModel)[] = ["GameId", "ClassificationId"];
			const store = db.createObjectStore(storeName, { keyPath });
			createIndex(store, index.BY_GAME_ID, "GameId");
		}
	},
};
