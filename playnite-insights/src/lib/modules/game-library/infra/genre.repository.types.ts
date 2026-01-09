import type { ClientRepositoryStoreName } from '$lib/modules/common/infra';

export type GenreRepositoryIndex = 'byId' | 'bySourceUpdatedAt';

export type GenreRepositoryMeta = {
	storeName: ClientRepositoryStoreName;
	index: Record<GenreRepositoryIndex, GenreRepositoryIndex>;
};
