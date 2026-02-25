import type { SyncCursor } from "@playatlas/common/infra";

export type GetAllGameClassificationsQuery = {
	lastCursor?: SyncCursor | null;
};
