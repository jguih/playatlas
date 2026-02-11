import type { IPlayAtlasClientPort } from "$lib/modules/common/application/playatlas-client.port";
import type {
	ISyncRunnerPort,
	SyncRunnerFetchResult,
} from "$lib/modules/common/application/sync-runner.port";
import type { GameResponseDto } from "@playatlas/game-library/dtos";
import type { ISyncGamesCommandHandlerPort } from "../commands/sync-games/sync-games.command-handler";
import type { IGameMapperPort } from "./game.mapper.port";

export interface ISyncGamesFlowPort {
	executeAsync: () => Promise<void>;
}

export type SyncGameLibraryServiceDeps = {
	playAtlasClient: IPlayAtlasClientPort;
	syncGamesCommandHandler: ISyncGamesCommandHandlerPort;
	gameMapper: IGameMapperPort;
	syncRunner: ISyncRunnerPort;
};

export class SyncGamesFlow implements ISyncGamesFlowPort {
	constructor(private readonly deps: SyncGameLibraryServiceDeps) {}

	private fetchAsync = async ({
		lastCursor,
	}: {
		lastCursor: string | null;
	}): Promise<SyncRunnerFetchResult<GameResponseDto>> => {
		const response = await this.deps.playAtlasClient.getGamesAsync({
			lastCursor,
		});

		if (!response.success) return { success: false };

		return {
			success: true,
			items: response.games,
			nextCursor: response.nextCursor,
		};
	};

	executeAsync: ISyncGamesFlowPort["executeAsync"] = async () => {
		const { syncRunner, gameMapper, syncGamesCommandHandler } = this.deps;

		await syncRunner.runAsync({
			syncTarget: "games",
			fetchAsync: this.fetchAsync,
			mapDtoToEntity: ({ dto, now }) => gameMapper.fromDto(dto, now),
			persistAsync: ({ entities }) => syncGamesCommandHandler.executeAsync({ games: entities }),
		});
	};
}
