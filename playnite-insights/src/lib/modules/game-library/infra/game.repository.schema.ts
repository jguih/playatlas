import type { IIndexedDbSchema } from "$lib/modules/common/infra";
import type { GameRepositoryMeta } from "./game.repository.types";

export const gameRepositoryMeta: GameRepositoryMeta = {
	storeName: "games",
	index: {
		bySourceUpdatedAt: "bySourceUpdatedAt",
		byDeletedAt: "byDeletedAt",
	},
};

export const gameRepositorySchema: IIndexedDbSchema = {
	define({ db }) {
		if (!db.objectStoreNames.contains(gameRepositoryMeta.storeName)) {
			const store = db.createObjectStore(gameRepositoryMeta.storeName, { keyPath: "Id" });
			store.createIndex(gameRepositoryMeta.index.bySourceUpdatedAt, ["SourceUpdatedAtMs", "Id"]);
			store.createIndex(gameRepositoryMeta.index.byDeletedAt, ["DeletedAt", "Id"]);
		}
	},
};
