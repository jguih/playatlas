import type { IPlayAtlasClientPort } from "$lib/modules/common/application/playatlas-client.port";
import type {
	ISyncRunnerPort,
	SyncRunnerFetchResult,
} from "$lib/modules/common/application/sync-runner";
import type { GameId } from "$lib/modules/common/domain";
import type { ClassificationId } from "@playatlas/common/domain";
import type { GameClassificationResponseDto } from "@playatlas/game-library/dtos";
import type { ISyncGameClassificationsCommandHandlerPort } from "../commands/sync-game-classifications/sync-game-classifications.command-handler";
import type { GameClassification } from "../domain";
import type { IGameVectorWriteStore } from "../infra/scoring-engine/game-vector.write-store";
import type { IGameClassificationMapperPort } from "./scoring-engine/game-classification.mapper.port";

export interface ISyncGameClassificationsFlowPort {
	executeAsync: () => Promise<void>;
}

export type SyncGameClassificationsFlowDeps = {
	playAtlasClient: IPlayAtlasClientPort;
	syncGameClassificationsCommandHandler: ISyncGameClassificationsCommandHandlerPort;
	gameClassificationMapper: IGameClassificationMapperPort;
	syncRunner: ISyncRunnerPort;
	gameVectorWriteStore: IGameVectorWriteStore;
};

export class SyncGameClassificationsFlow implements ISyncGameClassificationsFlowPort {
	constructor(private readonly deps: SyncGameClassificationsFlowDeps) {}

	private fetchAsync = async ({
		lastCursor,
	}: {
		lastCursor: string | null;
	}): Promise<SyncRunnerFetchResult<GameClassificationResponseDto>> => {
		const response = await this.deps.playAtlasClient.getGameClassificationsAsync({
			lastCursor,
		});

		if (!response.success) return { success: false };

		return {
			success: true,
			items: response.gameClassifications,
			nextCursor: response.nextCursor,
		};
	};

	private updateGameVectorsAsync = async (props: { gameClassifications: GameClassification[] }) => {
		const normalizedScoresPerGame = new Map<GameId, Map<ClassificationId, number>>();
		const toDelete: GameClassification[] = [];

		for (const gameClassification of props.gameClassifications) {
			if (gameClassification.DeletedAt) {
				toDelete.push(gameClassification);
				continue;
			}

			let normalizedScores = normalizedScoresPerGame.get(gameClassification.GameId);
			if (!normalizedScores) {
				normalizedScores = new Map();
				normalizedScoresPerGame.set(gameClassification.GameId, normalizedScores);
			}
			normalizedScores.set(gameClassification.ClassificationId, gameClassification.NormalizedScore);
		}

		for (const [gameId, normalizedScoreMap] of normalizedScoresPerGame) {
			for (const [classificationId, normalizedScore] of normalizedScoreMap) {
				await this.deps.gameVectorWriteStore.upsertAsync({
					gameId,
					classificationId,
					normalizedScore,
				});
			}
		}

		for (const { GameId, ClassificationId } of toDelete) {
			await this.deps.gameVectorWriteStore.deleteAsync({
				gameId: GameId,
				classificationId: ClassificationId,
			});
		}
	};

	executeAsync: ISyncGameClassificationsFlowPort["executeAsync"] = async () => {
		const { syncRunner, gameClassificationMapper, syncGameClassificationsCommandHandler } =
			this.deps;

		await syncRunner.runAsync({
			syncTarget: "gameClassifications",
			fetchAsync: this.fetchAsync,
			mapDtoToEntity: ({ dto, now }) => gameClassificationMapper.fromDto(dto, now),
			persistAsync: async ({ entities }) => {
				await syncGameClassificationsCommandHandler.executeAsync({
					gameClassifications: entities,
				});
				await this.updateGameVectorsAsync({ gameClassifications: entities });
			},
		});
	};
}
