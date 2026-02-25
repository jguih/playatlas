import type { SyncCursor } from "@playatlas/common/infra";
import type { ClassificationResponseDto } from "../../dtos";

export type GetAllClassificationsQueryResult = {
	nextCursor: SyncCursor;
	data: ClassificationResponseDto[];
};
