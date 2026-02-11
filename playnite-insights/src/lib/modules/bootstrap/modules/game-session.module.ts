import type { IClockPort, ILogServicePort } from "$lib/modules/common/application";
import {
	GameSessionReadModelMapper,
	type IGameSessionReadModelMapperPort,
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
};

export class GameSessionModule implements IClientGameSessionModulePort {
	readonly gameSessionMapper: IGameSessionReadModelMapperPort;
	readonly gameSessionReadonlyStore: IGameSessionReadonlyStore;
	readonly gameSessionWriteStore: IGameSessionWriteStorePort;

	constructor(private readonly deps: GameSessionModuleDeps) {
		const { dbSignal, clock } = deps;

		this.gameSessionMapper = new GameSessionReadModelMapper({ clock });
		this.gameSessionReadonlyStore = new GameSessionReadonlyStore({ dbSignal });
		this.gameSessionWriteStore = new GameSessionWriteStore({
			dbSignal,
			gameSessionMapper: this.gameSessionMapper,
		});
	}
}
