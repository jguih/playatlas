import type { ClientRepositoryMeta, IIndexedDbSchema } from "$lib/modules/common/infra";
import type { GameSessionReadModel } from "../application";

export const gameSessionStoreMeta = {
	storeName: "game-sessions",
	index: {
		BY_GAME_ID: "byGameId",
		BY_LAST_UPDATED_AT: "bySourceLastUpdatedAtMs",
	},
} as const satisfies ClientRepositoryMeta<string, string>;

export type GameSessionStoreIndex =
	(typeof gameSessionStoreMeta.index)[keyof typeof gameSessionStoreMeta.index];

const createIndex = (
	store: IDBObjectStore,
	name: GameSessionStoreIndex,
	keyPath: (keyof GameSessionReadModel)[] | keyof GameSessionReadModel,
	options?: IDBIndexParameters,
) => store.createIndex(name, keyPath, options);

export const gameSessionStoreSchema: IIndexedDbSchema = {
	define: ({ db }) => {
		const { storeName, index } = gameSessionStoreMeta;

		if (!db.objectStoreNames.contains(storeName)) {
			const keyPath: keyof GameSessionReadModel = "SessionId";
			const store = db.createObjectStore(storeName, { keyPath });
			createIndex(store, index.BY_GAME_ID, ["GameId", "SourceLastUpdatedAtMs", "SessionId"]);
			createIndex(store, index.BY_LAST_UPDATED_AT, ["SourceLastUpdatedAtMs", "SessionId"]);
		}
	},
};
