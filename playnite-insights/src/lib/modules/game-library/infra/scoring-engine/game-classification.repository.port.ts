import type { GameClassificationId, GameId } from "$lib/modules/common/domain";
import type { IClientEntityRepository } from "$lib/modules/common/infra";
import type { ClassificationId } from "@playatlas/common/domain";
import type { GameClassification } from "../../domain";

export type IGameClassificationRepositoryPort = IClientEntityRepository<
	GameClassification,
	GameClassificationId
> & {
	getByGameIdAsync: (gameId: GameId) => Promise<Map<ClassificationId, Set<GameClassification>>>;
};
