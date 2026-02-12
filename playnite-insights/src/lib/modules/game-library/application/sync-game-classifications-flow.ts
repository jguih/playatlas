import type { IPlayAtlasClientPort } from "$lib/modules/common/application/playatlas-client.port";
import type {
	ISyncRunnerPort,
	SyncRunnerFetchResult,
} from "$lib/modules/common/application/sync-runner.port";
import type { GameClassificationResponseDto } from "@playatlas/game-library/dtos";
import type { ISyncGameClassificationsCommandHandlerPort } from "../commands/sync-game-classifications/sync-game-classifications.command-handler";
import type { IGameVectorProjectionWriterPort } from "./recommendation-engine/game-vector-projection-writer.service";
import type { IGameClassificationMapperPort } from "./scoring-engine/game-classification.mapper.port";

export interface ISyncGameClassificationsFlowPort {
	executeAsync: () => Promise<void>;
}

export type SyncGameClassificationsFlowDeps = {
	playAtlasClient: IPlayAtlasClientPort;
	syncGameClassificationsCommandHandler: ISyncGameClassificationsCommandHandlerPort;
	gameClassificationMapper: IGameClassificationMapperPort;
	syncRunner: ISyncRunnerPort;
	gameVectorProjectionWriter: IGameVectorProjectionWriterPort;
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

	executeAsync: ISyncGameClassificationsFlowPort["executeAsync"] = async () => {
		const {
			syncRunner,
			gameClassificationMapper,
			syncGameClassificationsCommandHandler,
			gameVectorProjectionWriter,
		} = this.deps;

		await syncRunner.runAsync({
			syncTarget: "gameClassifications",
			fetchAsync: this.fetchAsync,
			mapDtoToEntity: ({ dto, now }) => gameClassificationMapper.fromDto(dto, now),
			persistAsync: async ({ entities: gameClassifications }) => {
				await syncGameClassificationsCommandHandler.executeAsync({ gameClassifications });
				await gameVectorProjectionWriter.projectAsync({ gameClassifications });
			},
		});
	};
}
