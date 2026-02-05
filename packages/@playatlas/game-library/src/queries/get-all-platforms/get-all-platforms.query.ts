import type { SyncCursor } from "@playatlas/common/infra";

export type GetAllPlatformsQuery = {
	lastCursor?: SyncCursor | null;
};
