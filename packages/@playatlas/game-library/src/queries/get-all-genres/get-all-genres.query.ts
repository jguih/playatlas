import type { SyncCursor } from "@playatlas/common/infra";

export type GetAllGenresQuery = {
	lastCursor?: SyncCursor | null;
};
