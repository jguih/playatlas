import type { SyncCursor } from "@playatlas/common/infra";

export type GameClassificationRepositoryFilters = {
	syncCursor?: SyncCursor | null;
};
