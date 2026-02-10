import type { GameClassificationId } from "$lib/modules/common/domain";
import type { IClientEntityRepository } from "$lib/modules/common/infra";
import type { GameClassification } from "../../domain";

export type IGameClassificationRepositoryPort = IClientEntityRepository<
	GameClassification,
	GameClassificationId
>;
