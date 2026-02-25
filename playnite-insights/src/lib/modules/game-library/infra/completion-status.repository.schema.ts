import type { IIndexedDbSchema } from "$lib/modules/common/infra";
import type { CompletionStatusModel } from "./completion-status.repository";
import type {
	CompletionStatusRepositoryIndex,
	CompletionStatusRepositoryMeta,
} from "./completion-status.repository.types";

export const completionStatusRepositoryMeta = {
	storeName: "completion-status",
	index: { bySourceLastUpdatedAt: "bySourceLastUpdatedAt" },
} as const satisfies CompletionStatusRepositoryMeta;

export const completionStatusRepositorySchema: IIndexedDbSchema = {
	define({ db }) {
		const { storeName, index } = completionStatusRepositoryMeta;

		const createIndex = (
			store: IDBObjectStore,
			name: CompletionStatusRepositoryIndex,
			keyPath: (keyof CompletionStatusModel)[] | keyof CompletionStatusModel,
			options?: IDBIndexParameters,
		) => store.createIndex(name, keyPath, options);

		if (!db.objectStoreNames.contains(storeName)) {
			const store = db.createObjectStore(storeName, {
				keyPath: "Id",
			});
			createIndex(store, index.bySourceLastUpdatedAt, ["SourceLastUpdatedAtMs", "Id"]);
		}
	},
};
