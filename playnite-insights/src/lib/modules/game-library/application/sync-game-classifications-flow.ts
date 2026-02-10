import type { GameClassificationResponseDto } from "@playatlas/game-library/dtos";
import type { ISyncGameClassificationsCommandHandlerPort } from "../commands/sync-game-classifications/sync-game-classifications.command-handler";
import type { IPlayAtlasClientPort } from "./playatlas-client.port";
import type { IGameClassificationMapperPort } from "./scoring-engine/game-classification.mapper.port";
import type { ISyncRunnerPort, SyncRunnerFetchResult } from "./sync-runner";

export interface ISyncGameClassificationsFlowPort {
	executeAsync: () => Promise<void>;
}

export type SyncGameClassificationsFlowDeps = {
	playAtlasClient: IPlayAtlasClientPort;
	syncGameClassificationsCommandHandler: ISyncGameClassificationsCommandHandlerPort;
	gameClassificationMapper: IGameClassificationMapperPort;
	syncRunner: ISyncRunnerPort;
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
		const { syncRunner, gameClassificationMapper, syncGameClassificationsCommandHandler } =
			this.deps;

		await syncRunner.runAsync({
			syncTarget: "gameClassifications",
			fetchAsync: this.fetchAsync,
			mapDtoToEntity: ({ dto, now }) => gameClassificationMapper.fromDto(dto, now),
			persistAsync: ({ entities }) =>
				syncGameClassificationsCommandHandler.executeAsync({ gameClassifications: entities }),
		});
	};
}
