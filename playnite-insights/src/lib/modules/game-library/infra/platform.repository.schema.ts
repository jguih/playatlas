import type { IIndexedDbSchema } from "$lib/modules/common/infra";
import type { PlatformModel } from "./platform.repository";
import type { PlatformRepositoryIndex, PlatformRepositoryMeta } from "./platform.repository.types";

export const platformRepositoryMeta: PlatformRepositoryMeta = {
	storeName: "platforms",
	index: { bySourceLastUpdatedAt: "bySourceLastUpdatedAt" },
};

export const platformRepositorySchema: IIndexedDbSchema = {
	define({ db }) {
		const { index, storeName } = platformRepositoryMeta;

		const createIndex = (
			store: IDBObjectStore,
			name: PlatformRepositoryIndex,
			keyPath: (keyof PlatformModel)[],
		) => store.createIndex(name, keyPath);

		if (!db.objectStoreNames.contains(storeName)) {
			const store = db.createObjectStore(storeName, { keyPath: "Id" });
			createIndex(store, index.bySourceLastUpdatedAt, ["SourceLastUpdatedAtMs", "Id"]);
		}
	},
};
