import type { SyncCursor } from "@playatlas/common/infra";

export type GenreRepositoryFilters = {
	syncCursor?: SyncCursor | null;
};
