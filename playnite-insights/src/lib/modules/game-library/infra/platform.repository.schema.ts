import type { IIndexedDbSchema } from '$lib/modules/common/infra';
import type { PlatformRepositoryMeta } from './platform.repository.types';

export const platformRepositoryMeta: PlatformRepositoryMeta = {
	storeName: 'platforms',
	index: { bySourceUpdatedAt: 'bySourceUpdatedAt' },
};

export const platformRepositorySchema: IIndexedDbSchema = {
	define({ db }) {
		if (!db.objectStoreNames.contains(platformRepositoryMeta.storeName)) {
			const store = db.createObjectStore(platformRepositoryMeta.storeName, { keyPath: 'Id' });
			store.createIndex(platformRepositoryMeta.index.bySourceUpdatedAt, 'SourceUpdatedAt');
		}
	},
};
