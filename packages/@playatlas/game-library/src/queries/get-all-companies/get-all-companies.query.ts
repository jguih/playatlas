import type { SyncCursor } from "@playatlas/common/infra";

export type GetAllCompaniesQuery = {
	lastCursor?: SyncCursor | null;
};
