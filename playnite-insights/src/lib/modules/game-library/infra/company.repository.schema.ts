import type { IIndexedDbSchema } from '$lib/modules/common/infra';
import type { CompanyRepositoryMeta } from './company.repository.types';

export const companyRepositoryMeta: CompanyRepositoryMeta = {
	storeName: 'companies',
	index: { bySourceUpdatedAt: 'bySourceUpdatedAt' },
};

export const companyRepositorySchema: IIndexedDbSchema = {
	define({ db }) {
		if (!db.objectStoreNames.contains(companyRepositoryMeta.storeName)) {
			const store = db.createObjectStore(companyRepositoryMeta.storeName, { keyPath: 'Id' });
			store.createIndex(companyRepositoryMeta.index.bySourceUpdatedAt, 'SourceUpdatedAt');
		}
	},
};
