import type { GameClassification } from "../../domain/scoring-engine/game-classification.entity";
import type {
	IGameRecommendationRecordReadonlyStore,
	IGameRecommendationRecordWriteStore,
} from "../../infra";
import type { IGameVectorProjectionServicePort } from "./game-vector-projection.service";

export type IGameRecommendationRecordProjectionWriterPort = {
	projectFromGameClassificationAsync: (props: {
		gameClassifications: GameClassification[];
	}) => Promise<void>;
};

export type GameRecommendationRecordProjectionWriterDeps = {
	gameRecommendationRecordWriteStore: IGameRecommendationRecordWriteStore;
	gameRecommendationRecordReadonlyStore: IGameRecommendationRecordReadonlyStore;
	gameVectorProjectionService: IGameVectorProjectionServicePort;
};

export class GameRecommendationRecordProjectionWriter implements IGameRecommendationRecordProjectionWriterPort {
	constructor(private readonly deps: GameRecommendationRecordProjectionWriterDeps) {}

	projectFromGameClassificationAsync: IGameRecommendationRecordProjectionWriterPort["projectFromGameClassificationAsync"] =
		async ({ gameClassifications }) => {
			const gameIds = gameClassifications.map((gc) => gc.GameId);

			for (const gameId of gameIds) {
				const record =
					await this.deps.gameRecommendationRecordReadonlyStore.getByGameIdAsync(gameId);
				const vector = this.deps.gameVectorProjectionService.getVector(gameId);

				if (vector && record)
					await this.deps.gameRecommendationRecordWriteStore.upsertAsync({
						...record,
						Vector: vector,
					});
				else if (vector) {
					await this.deps.gameRecommendationRecordWriteStore.upsertAsync({
						GameId: gameId,
						Vector: vector,
					});
				}
			}
		};
}
