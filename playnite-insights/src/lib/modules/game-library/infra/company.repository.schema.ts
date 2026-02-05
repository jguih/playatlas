import type { IIndexedDbSchema } from "$lib/modules/common/infra";
import type { CompanyModel } from "./company.repository";
import type { CompanyRepositoryIndex, CompanyRepositoryMeta } from "./company.repository.types";

export const companyRepositoryMeta = {
	storeName: "companies",
	index: { bySourceLastUpdatedAt: "bySourceLastUpdatedAt" },
} as const satisfies CompanyRepositoryMeta;

export const companyRepositorySchema: IIndexedDbSchema = {
	define({ db }) {
		const { storeName, index } = companyRepositoryMeta;

		const createIndex = (
			store: IDBObjectStore,
			name: CompanyRepositoryIndex,
			keyPath: (keyof CompanyModel)[] | keyof CompanyModel,
			options?: IDBIndexParameters,
		) => store.createIndex(name, keyPath, options);

		if (!db.objectStoreNames.contains(storeName)) {
			const store = db.createObjectStore(storeName, { keyPath: "Id" });
			createIndex(store, index.bySourceLastUpdatedAt, ["SourceLastUpdatedAtMs", "Id"]);
		}
	},
};
