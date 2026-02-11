import type {
	IPlayAtlasClientPort,
	ISyncRunnerPort,
	SyncRunnerFetchResult,
} from "$lib/modules/common/application";
import type { GameSessionResponseDto } from "@playatlas/game-session/dtos";
import type { IGameSessionWriteStorePort } from "../infra/game-session.write-store";
import type { IGameSessionReadModelMapperPort } from "./game-session.read-model";

export interface ISyncGameSessionsFlowPort {
	executeAsync: () => Promise<void>;
}

export type SyncGameSessionsFlowDeps = {
	playAtlasClient: IPlayAtlasClientPort;
	gameSessionsWriteStore: IGameSessionWriteStorePort;
	gameSessionMapper: IGameSessionReadModelMapperPort;
	syncRunner: ISyncRunnerPort;
};

export class SyncGameSessionsFlow implements ISyncGameSessionsFlowPort {
	constructor(private readonly deps: SyncGameSessionsFlowDeps) {}

	private fetchAsync = async ({
		lastCursor,
	}: {
		lastCursor: string | null;
	}): Promise<SyncRunnerFetchResult<GameSessionResponseDto>> => {
		const response = await this.deps.playAtlasClient.getGameSessionsAsync({
			lastCursor,
		});

		if (!response.success) return { success: false };

		return {
			success: true,
			items: response.gameSessions,
			nextCursor: response.nextCursor,
		};
	};

	executeAsync: ISyncGameSessionsFlowPort["executeAsync"] = async () => {
		const { syncRunner, gameSessionMapper, gameSessionsWriteStore } = this.deps;

		await syncRunner.runAsync({
			syncTarget: "gameSessions",
			fetchAsync: this.fetchAsync,
			mapDtoToEntity: ({ dto, now }) => gameSessionMapper.fromDto(dto, now),
			persistAsync: ({ entities }) =>
				gameSessionsWriteStore.upsertAsync({ gameSessionDto: entities }),
		});
	};
}
