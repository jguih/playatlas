import type { SyncStatus } from "$lib/modules/common/common";
import type { GameClassificationId, GameId } from "$lib/modules/common/domain";
import { ClientEntityRepository, type ClientEntityRepositoryDeps } from "$lib/modules/common/infra";
import type { ClassificationId, EngineScoreMode } from "@playatlas/common/domain";
import type { IGameClassificationMapperPort } from "../../application/scoring-engine/game-classification.mapper.port";
import type {
	GameClassification,
	GameClassificationBreakdown,
} from "../../domain/scoring-engine/game-classification.entity";
import type { IGameClassificationRepositoryPort } from "./game-classification.repository.port";
import { gameClassificationRepositoryMeta } from "./game-classification.repository.schema";

export type GameClassificationModel = {
	Id: GameClassificationId;
	SourceLastUpdatedAt: Date;
	SourceLastUpdatedAtMs: number;
	GameId: GameId;
	ClassificationId: ClassificationId;
	Score: number;
	NormalizedScore: number;
	ScoreMode: EngineScoreMode;
	Breakdown: GameClassificationBreakdown;

	Sync: {
		Status: SyncStatus;
		ErrorMessage?: string | null;
		LastSyncedAt: Date;
	};
};

export type GameClassificationRepositoryDeps = ClientEntityRepositoryDeps & {
	gameClassificationMapper: IGameClassificationMapperPort;
};

export class GameClassificationRepository
	extends ClientEntityRepository<GameClassificationId, GameClassification, GameClassificationModel>
	implements IGameClassificationRepositoryPort
{
	constructor({ dbSignal, gameClassificationMapper }: GameClassificationRepositoryDeps) {
		super({
			dbSignal,
			storeName: gameClassificationRepositoryMeta.storeName,
			mapper: gameClassificationMapper,
		});
	}
}
