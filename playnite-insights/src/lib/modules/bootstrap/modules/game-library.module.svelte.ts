import type { IDateTimeHandlerPort } from '$lib/modules/common/infra/date-time-handler.port';
import { GameRepository } from '$lib/modules/game-library/infra/game.repository';
import { GetGamesQueryHandler } from '$lib/modules/game-library/queries/get-games/get-games.query-handler.svelte';
import type { IClientGameLibraryModulePort } from './game-library.module.port';
import type { IndexedDbSignal } from './infra.module.port';

export type ClientGameLibraryModuleDeps = {
	dateTimeHandler: IDateTimeHandlerPort;
	indexedDbSignal: IndexedDbSignal;
};

export class ClientGameLibraryModule implements IClientGameLibraryModulePort {
	readonly gameRepository: IClientGameLibraryModulePort['gameRepository'];
	readonly getGamesQueryHandler: IClientGameLibraryModulePort['getGamesQueryHandler'];

	constructor({ dateTimeHandler, indexedDbSignal }: ClientGameLibraryModuleDeps) {
		this.gameRepository = new GameRepository({ dateTimeHandler, indexedDbSignal });
		this.getGamesQueryHandler = new GetGamesQueryHandler({ gameRepository: this.gameRepository });
	}
}
