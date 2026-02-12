import type { SyncCursor } from "@playatlas/common/infra";

export type TagRepositoryFilters = {
	syncCursor?: SyncCursor | null;
};
