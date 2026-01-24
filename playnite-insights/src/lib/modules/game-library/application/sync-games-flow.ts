import type { IClockPort } from "$lib/modules/common/application";
import type { ISyncGamesCommandHandlerPort } from "../commands/sync-games/sync-games.command-handler";
import type { IGameLibrarySyncStatePort } from "./game-library-sync-state.port";
import type { IGameMapperPort } from "./game.mapper";
import type { IPlayAtlasClientPort } from "./playatlas-client.port";
import type { ISyncGamesFlowPort } from "./sync-games-flow.port";

export type SyncGameLibraryServiceDeps = {
	gameLibrarySyncState: IGameLibrarySyncStatePort;
	playAtlasClient: IPlayAtlasClientPort;
	syncGamesCommandHandler: ISyncGamesCommandHandlerPort;
	clock: IClockPort;
	gameMapper: IGameMapperPort;
};

export class SyncGamesFlow implements ISyncGamesFlowPort {
	private readonly gameLibrarySyncState: IGameLibrarySyncStatePort;
	private readonly playAtlasClient: IPlayAtlasClientPort;
	private readonly syncGamesCommandHandler: ISyncGamesCommandHandlerPort;
	private readonly clock: IClockPort;
	private readonly gameMapper: IGameMapperPort;

	constructor({
		gameLibrarySyncState,
		playAtlasClient,
		syncGamesCommandHandler,
		clock,
		gameMapper,
	}: SyncGameLibraryServiceDeps) {
		this.gameLibrarySyncState = gameLibrarySyncState;
		this.playAtlasClient = playAtlasClient;
		this.syncGamesCommandHandler = syncGamesCommandHandler;
		this.clock = clock;
		this.gameMapper = gameMapper;
	}

	executeAsync: ISyncGamesFlowPort["executeAsync"] = async () => {
		const lastSync = this.gameLibrarySyncState.getLastServerSync();

		const response = await this.playAtlasClient.getGamesAsync({
			sinceLastSync: lastSync ?? new Date(0),
		});

		if (!response.success) return;

		const games = response.games.map((g) => this.gameMapper.toDomain(g, lastSync));

		await this.syncGamesCommandHandler.executeAsync({ games });

		this.gameLibrarySyncState.setLastServerSync(this.clock.now());
	};
}
