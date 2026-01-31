import type { ClientRepositoryStoreName } from "$lib/modules/common/infra";

export type GameLibraryFilterRepositoryIndex =
	| "bySourceUpdatedAt"
	| "byLastUsedAt"
	| "byUseCount"
	| "byHash";

export type GameLibraryFilterRepositoryMeta = {
	storeName: ClientRepositoryStoreName;
	index: Record<GameLibraryFilterRepositoryIndex, GameLibraryFilterRepositoryIndex>;
};
