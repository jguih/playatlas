import type { SyncCursor } from "@playatlas/common/infra";

export type PlatformRepositoryFilters = {
	syncCursor?: SyncCursor | null;
};
