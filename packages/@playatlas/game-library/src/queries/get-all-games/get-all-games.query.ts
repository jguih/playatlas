import type { SyncCursor } from "@playatlas/common/common";

export type GetAllGamesQuery = {
	lastCursor?: SyncCursor | null;
};
