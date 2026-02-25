import type { SyncCursor } from "@playatlas/common/infra";

export type GetAllGameSessionsQuery = {
	lastCursor?: SyncCursor | null;
};
