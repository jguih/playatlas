import type {
	IClockPort,
	ILogServicePort,
	IPlayAtlasClientPort,
	ISyncRunnerPort,
} from "$lib/modules/common/application";
import {
	GameSessionReadModelMapper,
	SyncGameSessionsFlow,
	type IGameSessionReadModelMapperPort,
	type ISyncGameSessionsFlowPort,
} from "$lib/modules/game-session/application";
import {
	GameSessionReadonlyStore,
	GameSessionWriteStore,
	type IGameSessionReadonlyStore,
	type IGameSessionWriteStorePort,
} from "$lib/modules/game-session/infra";
import type { IClientGameSessionModulePort } from "./game-session.module.port";

export type GameSessionModuleDeps = {
	dbSignal: IDBDatabase;
	clock: IClockPort;
	logService: ILogServicePort;
	playAtlasClient: IPlayAtlasClientPort;
	syncRunner: ISyncRunnerPort;
};

export class GameSessionModule implements IClientGameSessionModulePort {
	readonly gameSessionMapper: IGameSessionReadModelMapperPort;
	readonly gameSessionReadonlyStore: IGameSessionReadonlyStore;
	readonly gameSessionWriteStore: IGameSessionWriteStorePort;
	readonly syncGameSessionsFlow: ISyncGameSessionsFlowPort;

	constructor(private readonly deps: GameSessionModuleDeps) {
		const { dbSignal, clock, playAtlasClient, syncRunner } = deps;

		this.gameSessionMapper = new GameSessionReadModelMapper({ clock });
		this.gameSessionReadonlyStore = new GameSessionReadonlyStore({ dbSignal });
		this.gameSessionWriteStore = new GameSessionWriteStore({
			dbSignal,
			gameSessionMapper: this.gameSessionMapper,
		});
		this.syncGameSessionsFlow = new SyncGameSessionsFlow({
			gameSessionMapper: this.gameSessionMapper,
			gameSessionsWriteStore: this.gameSessionWriteStore,
			playAtlasClient,
			syncRunner,
		});
	}
}
