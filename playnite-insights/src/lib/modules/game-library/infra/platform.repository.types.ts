import type { ClientRepositoryStoreName } from "$lib/modules/common/infra";

export type PlatformRepositoryIndex = "bySourceLastUpdatedAt";

export type PlatformRepositoryMeta = {
	storeName: ClientRepositoryStoreName;
	index: Record<PlatformRepositoryIndex, PlatformRepositoryIndex>;
};
