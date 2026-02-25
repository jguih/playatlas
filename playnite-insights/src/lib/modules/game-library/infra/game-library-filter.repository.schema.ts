import type { IIndexedDbSchema } from "$lib/modules/common/infra";
import type { GameLibraryFilterModel } from "./game-library-filter.repository";
import type {
	GameLibraryFilterRepositoryIndex,
	GameLibraryFilterRepositoryMeta,
} from "./game-library-filter.repository.types";

export const gameLibraryFilterRepositoryMeta = {
	storeName: "game-library-filters",
	index: {
		byLastUsedAt: "byLastUsedAt",
		bySourceLastUpdatedAt: "bySourceLastUpdatedAt",
		byUseCount: "byUseCount",
		byHash: "byHash",
	},
} as const satisfies GameLibraryFilterRepositoryMeta;

export const gameLibraryFilterRepositorySchema: IIndexedDbSchema = {
	define: ({ db }) => {
		const { storeName, index } = gameLibraryFilterRepositoryMeta;

		const createIndex = (
			store: IDBObjectStore,
			name: GameLibraryFilterRepositoryIndex,
			keyPath: (keyof GameLibraryFilterModel)[] | keyof GameLibraryFilterModel,
			options?: IDBIndexParameters,
		) => store.createIndex(name, keyPath, options);

		if (!db.objectStoreNames.contains(storeName)) {
			const store = db.createObjectStore(storeName, {
				keyPath: "Id",
			});
			createIndex(store, index.bySourceLastUpdatedAt, ["SourceLastUpdatedAtMs", "Id"]);
			createIndex(store, index.byLastUsedAt, ["LastUsedAtMs", "Id"]);
			createIndex(store, index.byUseCount, ["UseCount", "Id"]);
			createIndex(store, index.byHash, "Key", { unique: true });
		}
	},
};
