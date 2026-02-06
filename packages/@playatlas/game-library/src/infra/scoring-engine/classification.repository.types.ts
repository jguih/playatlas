import type { SyncCursor } from "@playatlas/common/infra";

export type ClassificationRepositoryFilters = {
	syncCursor?: SyncCursor | null;
};
