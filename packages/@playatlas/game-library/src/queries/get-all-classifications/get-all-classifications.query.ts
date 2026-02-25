import type { SyncCursor } from "@playatlas/common/infra";

export type GetAllClassificationsQuery = {
	lastCursor?: SyncCursor | null;
};
