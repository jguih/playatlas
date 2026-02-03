import type { IDomainEventBusPort } from "$lib/modules/common/application";
import type { IAuthModulePort } from "../modules/auth.module.port";
import type { IClientGameLibraryModulePort } from "../modules/game-library.module.port";
import type { IClientInfraModulePort } from "../modules/infra.module.port";
import type { ClientApiV1 } from "./client-api.v1";

export type ClientModules = {
	infra: IClientInfraModulePort;
	gameLibrary: IClientGameLibraryModulePort;
	auth: IAuthModulePort;
};

export type ClientBootstrapperDeps = {
	modules: ClientModules;
	eventBus: IDomainEventBusPort;
};

export class ClientBootstrapper {
	private readonly infra: IClientInfraModulePort;
	private readonly gameLibrary: IClientGameLibraryModulePort;
	private readonly auth: IAuthModulePort;
	private readonly eventBus: IDomainEventBusPort;

	constructor({ modules, eventBus }: ClientBootstrapperDeps) {
		this.infra = modules.infra;
		this.gameLibrary = modules.gameLibrary;
		this.auth = modules.auth;
		this.eventBus = eventBus;
	}

	bootstrap(): ClientApiV1 {
		const api: ClientApiV1 = {
			GameLibrary: {
				Query: {
					GetGames: this.gameLibrary.getGamesQueryHandler,
					GetGamesByIds: this.gameLibrary.getGamesByIdsQueryHandler,
					GetGenreById: this.gameLibrary.getGenreByIdQueryHandler,
					GetGenresByIds: this.gameLibrary.getGenresByIdsQueryHandler,
					GetCompaniesByIds: this.gameLibrary.getCompaniesByIdsQueryHandler,
					GetPlatformsByIds: this.gameLibrary.getPlatformsByIdsQueryHandler,
					GetCompletionStatusesByIds: this.gameLibrary.getCompletionStatusesByIdsQueryHandler,
					GetGameLibraryFilters: this.gameLibrary.getGameLibraryFiltersQueryHandler,
				},
				Command: {
					SyncGames: this.gameLibrary.syncGamesCommandHandler,
					SyncGenres: this.gameLibrary.syncGenresCommandHandler,
					SyncCompanies: this.gameLibrary.syncCompaniesCommandHandler,
					SyncPlatforms: this.gameLibrary.syncPlatformsCommandHandler,
					SyncCompletionStatuses: this.gameLibrary.syncCompletionStatusesCommandHandler,
					CreateGameLibraryFilter: this.gameLibrary.createGameLibraryFilterCommandHandler,
				},
				SyncManager: this.gameLibrary.gameLibrarySyncManager,
				SyncProgressReporter: this.gameLibrary.syncProgressReporter,
			},
			Auth: {
				Flow: this.auth.authFlow,
			},
			EventBus: this.eventBus,
		};

		return Object.freeze(api);
	}
}
