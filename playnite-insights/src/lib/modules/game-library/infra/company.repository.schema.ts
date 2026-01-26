import type { IIndexedDbSchema } from "$lib/modules/common/infra";
import type { CompanyRepositoryMeta } from "./company.repository.types";

export const companyRepositoryMeta = {
	storeName: "companies",
	index: { bySourceUpdatedAt: "bySourceUpdatedAt" },
} as const satisfies CompanyRepositoryMeta;

export const companyRepositorySchema: IIndexedDbSchema = {
	define({ db }) {
		if (!db.objectStoreNames.contains(companyRepositoryMeta.storeName)) {
			const store = db.createObjectStore(companyRepositoryMeta.storeName, { keyPath: "Id" });
			store.createIndex(companyRepositoryMeta.index.bySourceUpdatedAt, ["SourceUpdatedAtMs", "Id"]);
		}
	},
};
