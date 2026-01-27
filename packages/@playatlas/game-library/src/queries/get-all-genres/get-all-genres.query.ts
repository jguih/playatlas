import type { SyncCursor } from "@playatlas/common/common";

export type GetAllGenresQuery = {
	lastCursor?: SyncCursor | null;
};
