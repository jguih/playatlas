import type { SyncCursor } from "@playatlas/common/infra";

export type GetAllGamesQuery = {
	lastCursor?: SyncCursor | null;
};
