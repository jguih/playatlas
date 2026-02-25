import type { SyncCursor } from "@playatlas/common/infra";

export type GetAllCompletionStatusesQuery = {
	lastCursor?: SyncCursor | null;
};
