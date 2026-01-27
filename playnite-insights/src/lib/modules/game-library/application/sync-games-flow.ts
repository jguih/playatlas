import type { IClockPort } from "$lib/modules/common/application";
import type { ISyncGamesCommandHandlerPort } from "../commands/sync-games/sync-games.command-handler";
import type { IGameLibrarySyncStatePort } from "./game-library-sync-state.port";
import type { IGameMapperPort } from "./game.mapper.port";
import type { IPlayAtlasClientPort } from "./playatlas-client.port";
import type { ISyncGamesFlowPort } from "./sync-games-flow.port";

export type SyncGameLibraryServiceDeps = {
	gameLibrarySyncState: IGameLibrarySyncStatePort;
	playAtlasClient: IPlayAtlasClientPort;
	syncGamesCommandHandler: ISyncGamesCommandHandlerPort;
	gameMapper: IGameMapperPort;
	clock: IClockPort;
};

export class SyncGamesFlow implements ISyncGamesFlowPort {
	private readonly gameLibrarySyncState: IGameLibrarySyncStatePort;
	private readonly playAtlasClient: IPlayAtlasClientPort;
	private readonly syncGamesCommandHandler: ISyncGamesCommandHandlerPort;
	private readonly gameMapper: IGameMapperPort;
	private readonly clock: IClockPort;

	constructor({
		gameLibrarySyncState,
		playAtlasClient,
		syncGamesCommandHandler,
		gameMapper,
		clock,
	}: SyncGameLibraryServiceDeps) {
		this.gameLibrarySyncState = gameLibrarySyncState;
		this.playAtlasClient = playAtlasClient;
		this.syncGamesCommandHandler = syncGamesCommandHandler;
		this.gameMapper = gameMapper;
		this.clock = clock;
	}

	executeAsync: ISyncGamesFlowPort["executeAsync"] = async () => {
		const now = this.clock.now();
		const lastCursor = this.gameLibrarySyncState.getLastServerSyncCursor("games");

		const response = await this.playAtlasClient.getGamesAsync({
			lastCursor,
		});

		if (!response.success) return;

		const games = response.games.map((g) => this.gameMapper.fromDto(g, now));

		await this.syncGamesCommandHandler.executeAsync({ games });

		this.gameLibrarySyncState.setLastServerSyncCursor("games", response.nextCursor);
	};
}
