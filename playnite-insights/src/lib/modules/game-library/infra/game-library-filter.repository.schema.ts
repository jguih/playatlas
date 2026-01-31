import type { IIndexedDbSchema } from "$lib/modules/common/infra";
import type { GameLibraryFilterRepositoryMeta } from "./game-library-filter.repository.types";

export const gameLibraryFilterRepositoryMeta = {
	storeName: "game-library-filters",
	index: {
		byLastUsedAt: "byLastUsedAt",
		bySourceUpdatedAt: "bySourceUpdatedAt",
		byUseCount: "byUseCount",
		byHash: "byHash",
	},
} as const satisfies GameLibraryFilterRepositoryMeta;

export const gameLibraryFilterRepositorySchema: IIndexedDbSchema = {
	define: ({ db }) => {
		if (!db.objectStoreNames.contains(gameLibraryFilterRepositoryMeta.storeName)) {
			const store = db.createObjectStore(gameLibraryFilterRepositoryMeta.storeName, {
				keyPath: "Id",
			});
			store.createIndex(gameLibraryFilterRepositoryMeta.index.bySourceUpdatedAt, [
				"SourceUpdatedAtMs",
				"Id",
			]);
			store.createIndex(gameLibraryFilterRepositoryMeta.index.byLastUsedAt, ["LastUsedAtMs", "Id"]);
			store.createIndex(gameLibraryFilterRepositoryMeta.index.byUseCount, ["UseCount", "Id"]);
			store.createIndex(gameLibraryFilterRepositoryMeta.index.byHash, "Hash", { unique: true });
		}
	},
};
