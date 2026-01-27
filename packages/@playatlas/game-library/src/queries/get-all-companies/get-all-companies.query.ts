import type { SyncCursor } from "@playatlas/common/common";

export type GetAllCompaniesQuery = {
	lastCursor?: SyncCursor | null;
};
