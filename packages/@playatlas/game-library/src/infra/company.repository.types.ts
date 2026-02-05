import type { SyncCursor } from "@playatlas/common/infra";

export type CompanyRepositoryFilters = {
	syncCursor?: SyncCursor | null;
};
