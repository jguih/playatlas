import type { SyncCursor } from "@playatlas/common/common";

export type GetAllPlatformsQuery = {
	lastCursor?: SyncCursor | null;
};
