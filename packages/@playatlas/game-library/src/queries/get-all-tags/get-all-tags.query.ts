import type { SyncCursor } from "@playatlas/common/infra";

export type GetAllTagsQuery = {
	lastCursor?: SyncCursor | null;
};
