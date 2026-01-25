import type { IIndexedDbSchema } from "$lib/modules/common/infra";
import type { CompletionStatusRepositoryMeta } from "./completion-status.repository.types";

export const completionStatusRepositoryMeta = {
	storeName: "completion-status",
	index: { bySourceUpdatedAt: "bySourceUpdatedAt" },
} as const satisfies CompletionStatusRepositoryMeta;

export const completionStatusRepositorySchema: IIndexedDbSchema = {
	define({ db }) {
		if (!db.objectStoreNames.contains(completionStatusRepositoryMeta.storeName)) {
			const store = db.createObjectStore(completionStatusRepositoryMeta.storeName, {
				keyPath: "Id",
			});
			store.createIndex(completionStatusRepositoryMeta.index.bySourceUpdatedAt, [
				"SourceUpdatedAtMs",
				"Id",
			]);
		}
	},
};
