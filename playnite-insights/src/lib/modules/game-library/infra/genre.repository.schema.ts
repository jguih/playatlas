import type { IIndexedDbSchema } from "$lib/modules/common/infra";
import type { GenreModel } from "./genre.repository";
import type { GenreRepositoryIndex, GenreRepositoryMeta } from "./genre.repository.types";

export const genreRepositoryMeta: GenreRepositoryMeta = {
	storeName: "genres",
	index: {
		bySourceLastUpdatedAt: "bySourceLastUpdatedAt",
	},
};

export const genreRepositorySchema: IIndexedDbSchema = {
	define({ db }) {
		const { index, storeName } = genreRepositoryMeta;

		const createIndex = (
			store: IDBObjectStore,
			name: GenreRepositoryIndex,
			keyPath: (keyof GenreModel)[],
		) => store.createIndex(name, keyPath);

		if (!db.objectStoreNames.contains(storeName)) {
			const store = db.createObjectStore(storeName, { keyPath: "Id" });
			createIndex(store, index.bySourceLastUpdatedAt, ["SourceLastUpdatedAtMs", "Id"]);
		}
	},
};
