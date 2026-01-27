import type { IIndexedDbSchema } from "$lib/modules/common/infra";
import type { GenreRepositoryMeta } from "./genre.repository.types";

export const genreRepositoryMeta: GenreRepositoryMeta = {
	storeName: "genres",
	index: {
		bySourceUpdatedAt: "bySourceUpdatedAt",
	},
};

export const genreRepositorySchema: IIndexedDbSchema = {
	define({ db }) {
		if (!db.objectStoreNames.contains(genreRepositoryMeta.storeName)) {
			const store = db.createObjectStore(genreRepositoryMeta.storeName, { keyPath: "Id" });
			store.createIndex(genreRepositoryMeta.index.bySourceUpdatedAt, ["SourceUpdatedAtMs", "Id"]);
		}
	},
};
