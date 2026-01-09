import type { IDateTimeHandlerPort } from '$lib/modules/common/infra';
import {
	SyncGamesCommandHandler,
	type ISyncGamesCommandHandlerPort,
} from '$lib/modules/game-library/commands/sync-games';
import { GameRepository, type IGameRepositoryPort } from '$lib/modules/game-library/infra';
import {
	GetGamesQueryHandler,
	type IGetGamesQueryHandlerPort,
} from '$lib/modules/game-library/queries/get-games';
import type { IClientGameLibraryModulePort } from './game-library.module.port';
import type { IndexedDbSignal } from './infra.module.port';

export type ClientGameLibraryModuleDeps = {
	dateTimeHandler: IDateTimeHandlerPort;
	indexedDbSignal: IndexedDbSignal;
};

export class ClientGameLibraryModule implements IClientGameLibraryModulePort {
	readonly gameRepository: IGameRepositoryPort;
	readonly getGamesQueryHandler: IGetGamesQueryHandlerPort;
	readonly syncGamesCommandHandler: ISyncGamesCommandHandlerPort;

	constructor({ dateTimeHandler, indexedDbSignal }: ClientGameLibraryModuleDeps) {
		this.gameRepository = new GameRepository({ dateTimeHandler, indexedDbSignal });
		this.getGamesQueryHandler = new GetGamesQueryHandler({ gameRepository: this.gameRepository });
		this.syncGamesCommandHandler = new SyncGamesCommandHandler({
			gameRepository: this.gameRepository,
		});
	}
}
