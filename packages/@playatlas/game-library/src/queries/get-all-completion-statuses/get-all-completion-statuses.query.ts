import type { SyncCursor } from "@playatlas/common/common";

export type GetAllCompletionStatusesQuery = {
	lastCursor?: SyncCursor | null;
};
