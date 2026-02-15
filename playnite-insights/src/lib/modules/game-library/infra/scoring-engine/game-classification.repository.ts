import type { SyncStatus } from "$lib/modules/common/common";
import type { GameClassificationId, GameId } from "$lib/modules/common/domain";
import { ClientEntityRepository, type ClientEntityRepositoryDeps } from "$lib/modules/common/infra";
import { type ClassificationId, type EngineScoreMode } from "@playatlas/common/domain";
import type { IGameClassificationMapperPort } from "../../application/scoring-engine/game-classification.mapper.port";
import type { EvidenceGroupMeta } from "../../domain/scoring-engine/evidence-group-meta.record";
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
	DeletedAt?: Date | null;
	DeleteAfter?: Date | null;
	GameId: GameId;
	ClassificationId: ClassificationId;
	Score: number;
	NormalizedScore: number;
	ScoreMode: EngineScoreMode;
	Breakdown: GameClassificationBreakdown;
	EvidenceGroupMeta?: EvidenceGroupMeta | null;

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

	getByGameIdAsync: IGameClassificationRepositoryPort["getByGameIdAsync"] = async (gameId) => {
		return await this.runTransaction([this.storeName], "readonly", async ({ tx }) => {
			const store = tx.objectStore(this.storeName);
			const idx = store.index(gameClassificationRepositoryMeta.index.BY_GAME_ID);
			const gameClassifications = new Map<ClassificationId, Set<GameClassification>>();
			const context = {
				found: false,
			};

			return await new Promise<Map<ClassificationId, Set<GameClassification>> | null>(
				(resolve, reject) => {
					const request = idx.openCursor(null, "next");

					request.onerror = () => reject(request.error);

					request.onsuccess = () => {
						const cursor = request.result;

						if (!cursor) {
							resolve(null);
							return;
						}

						const gameClassification: GameClassificationModel = cursor.value;

						if (gameClassification.GameId === gameId) {
							context.found = true;

							let classifications = gameClassifications.get(gameClassification.ClassificationId);

							if (!classifications) {
								classifications = new Set();
								gameClassifications.set(gameClassification.ClassificationId, classifications);
							}

							classifications.add(this.mapper.toDomain(gameClassification));
						} else if (context.found) {
							resolve(gameClassifications);
							return;
						}

						cursor.continue();
					};
				},
			);
		});
	};
}
