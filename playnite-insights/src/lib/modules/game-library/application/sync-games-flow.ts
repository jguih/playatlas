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
};

export class SyncGamesFlow implements ISyncGamesFlowPort {
	private readonly gameLibrarySyncState: IGameLibrarySyncStatePort;
	private readonly playAtlasClient: IPlayAtlasClientPort;
	private readonly syncGamesCommandHandler: ISyncGamesCommandHandlerPort;
	private readonly gameMapper: IGameMapperPort;

	constructor({
		gameLibrarySyncState,
		playAtlasClient,
		syncGamesCommandHandler,
		gameMapper,
	}: SyncGameLibraryServiceDeps) {
		this.gameLibrarySyncState = gameLibrarySyncState;
		this.playAtlasClient = playAtlasClient;
		this.syncGamesCommandHandler = syncGamesCommandHandler;
		this.gameMapper = gameMapper;
	}

	executeAsync: ISyncGamesFlowPort["executeAsync"] = async () => {
		const lastSync = this.gameLibrarySyncState.getLastServerSync("games");

		const response = await this.playAtlasClient.getGamesAsync({
			sinceLastSync: lastSync,
		});

		if (!response.success) return;

		const games = response.games.map((g) => this.gameMapper.toDomain(g, lastSync));

		await this.syncGamesCommandHandler.executeAsync({ games });

		this.gameLibrarySyncState.setLastServerSync("games", new Date(response.nextCursor));
	};
}
