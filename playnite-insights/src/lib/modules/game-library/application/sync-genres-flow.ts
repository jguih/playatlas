import type { GenreResponseDto } from "@playatlas/game-library/dtos";
import type { ISyncGenresCommandHandlerPort } from "../commands";
import type { IGenreMapperPort } from "./genre.mapper.port";
import type { IPlayAtlasClientPort } from "./playatlas-client.port";
import type { ISyncRunnerPort, SyncRunnerFetchResult } from "./sync-runner";

export interface ISyncGenresFlowPort {
	executeAsync: () => Promise<void>;
}

export type SyncGenresFlowDeps = {
	playAtlasClient: IPlayAtlasClientPort;
	syncGenresCommandHandler: ISyncGenresCommandHandlerPort;
	genreMapper: IGenreMapperPort;
	syncRunner: ISyncRunnerPort;
};

export class SyncGenresFlow implements ISyncGenresFlowPort {
	constructor(private readonly deps: SyncGenresFlowDeps) {}

	private fetchAsync = async ({
		lastCursor,
	}: {
		lastCursor: string | null;
	}): Promise<SyncRunnerFetchResult<GenreResponseDto>> => {
		const response = await this.deps.playAtlasClient.getGenresAsync({
			lastCursor,
		});

		if (!response.success) return { success: false };

		return {
			success: true,
			items: response.genres,
			nextCursor: response.nextCursor,
		};
	};

	executeAsync: ISyncGenresFlowPort["executeAsync"] = async () => {
		const { syncRunner, genreMapper, syncGenresCommandHandler } = this.deps;

		await syncRunner.runAsync({
			syncTarget: "genres",
			fetchAsync: this.fetchAsync,
			mapDtoToEntity: ({ dto, now }) => genreMapper.fromDto(dto, now),
			persistAsync: ({ entities }) => syncGenresCommandHandler.executeAsync({ genres: entities }),
		});
	};
}
