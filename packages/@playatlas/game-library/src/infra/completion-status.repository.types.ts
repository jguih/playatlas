import type { SyncCursor } from "@playatlas/common/infra";

export type CompletionStatusRepositoryFilters = {
	syncCursor?: SyncCursor | null;
};
