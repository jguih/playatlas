import type { ClientRepositoryStoreName } from "$lib/modules/common/infra";

export type GameLibraryFilterRepositoryIndex =
	| "bySourceLastUpdatedAt"
	| "byLastUsedAt"
	| "byUseCount"
	| "byHash";

export type GameLibraryFilterRepositoryMeta = {
	storeName: ClientRepositoryStoreName;
	index: Record<GameLibraryFilterRepositoryIndex, GameLibraryFilterRepositoryIndex>;
};
