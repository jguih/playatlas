import type { SyncCursor } from "@playatlas/common/infra";

export type GameSessionRepositoryFilters = {
	syncCursor?: SyncCursor | null;
};
