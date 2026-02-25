import type { IIndexedDbSchema } from "$lib/modules/common/infra";
import type { GameModel } from "./game.repository";
import type { GameRepositoryIndex, GameRepositoryMeta } from "./game.repository.types";

export const gameRepositoryMeta: GameRepositoryMeta = {
	storeName: "games",
	index: {
		bySourceLastUpdatedAt: "bySourceLastUpdatedAt",
		byDeletedAt: "byDeletedAt",
	},
};

export const gameRepositorySchema: IIndexedDbSchema = {
	define({ db }) {
		const { storeName, index } = gameRepositoryMeta;

		const createIndex = (
			store: IDBObjectStore,
			name: GameRepositoryIndex,
			keyPath: (keyof GameModel)[],
		) => store.createIndex(name, keyPath);

		if (!db.objectStoreNames.contains(storeName)) {
			const store = db.createObjectStore(storeName, { keyPath: "Id" });
			createIndex(store, index.bySourceLastUpdatedAt, ["SourceLastUpdatedAtMs", "Id"]);
			createIndex(store, index.byDeletedAt, ["DeletedAt", "Id"]);
		}
	},
};
