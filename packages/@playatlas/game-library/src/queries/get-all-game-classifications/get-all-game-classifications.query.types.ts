import type { SyncCursor } from "@playatlas/common/infra";
import type { GameClassificationResponseDto } from "../../dtos/game-classification.response.dto";

export type GetAllGameClassificationsQueryResult = {
	data: GameClassificationResponseDto[];
	nextCursor: SyncCursor;
};
