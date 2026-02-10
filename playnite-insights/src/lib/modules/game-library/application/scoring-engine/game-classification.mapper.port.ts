import type { IClientEntityMapper } from "$lib/modules/common/common";
import type { GameClassificationId } from "$lib/modules/common/domain";
import type { GameClassificationResponseDto } from "@playatlas/game-library/dtos";
import type { GameClassification } from "../../domain/scoring-engine/game-classification.entity";
import type { GameClassificationModel } from "../../infra/scoring-engine/game-classification.repository";

export type IGameClassificationMapperPort = IClientEntityMapper<
	GameClassificationId,
	GameClassification,
	GameClassificationModel
> & {
	fromDto: (dto: GameClassificationResponseDto, lastSync?: Date | null) => GameClassification;
};
