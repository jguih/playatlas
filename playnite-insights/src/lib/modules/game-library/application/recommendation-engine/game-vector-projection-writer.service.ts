import type { GameId } from "$lib/modules/common/domain";
import type { ClassificationId } from "@playatlas/common/domain";
import type { GameClassification } from "../../domain/scoring-engine/game-classification.entity";
import type { IGameVectorWriteStore } from "../../infra/recommendation-engine/game-vector.write-store";

export type IGameVectorProjectionWriterPort = {
	projectAsync(props: { gameClassifications: GameClassification[] }): Promise<void>;
};

export type GameVectorProjectionWriterDeps = {
	gameVectorWriteStore: IGameVectorWriteStore;
};

export class GameVectorProjectionWriter implements IGameVectorProjectionWriterPort {
	constructor(private readonly deps: GameVectorProjectionWriterDeps) {}

	projectAsync: IGameVectorProjectionWriterPort["projectAsync"] = async ({
		gameClassifications,
	}) => {
		const normalizedScoresPerGame = new Map<GameId, Map<ClassificationId, number>>();
		const toDelete: GameClassification[] = [];

		for (const gameClassification of gameClassifications) {
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
}
