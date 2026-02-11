import type { IDomainEventBusPort } from "$lib/modules/common/application";
import type { IClientGameSessionModulePort } from "../modules";
import type { IAuthModulePort } from "../modules/auth.module.port";
import type { IClientGameLibraryModulePort } from "../modules/game-library.module.port";
import type { IClientInfraModulePort } from "../modules/infra.module.port";
import type { ClientApiV1 } from "./client-api.v1";

export type ClientModules = {
	infra: IClientInfraModulePort;
	gameLibrary: IClientGameLibraryModulePort;
	auth: IAuthModulePort;
	gameSession: IClientGameSessionModulePort;
};

export type ClientBootstrapperDeps = {
	modules: ClientModules;
	eventBus: IDomainEventBusPort;
};

export class ClientBootstrapper {
	constructor(private readonly deps: ClientBootstrapperDeps) {}

	bootstrap(): ClientApiV1 {
		const {
			eventBus,
			modules: { auth, gameLibrary, gameSession },
		} = this.deps;

		const api: ClientApiV1 = {
			GameLibrary: {
				ScoringEngine: {
					Query: {
						GetGameClassifications: gameLibrary.getGameClassificationsByIdsQueryHandler,
						GetGameClassificationsByGameId: gameLibrary.getGameClassificationsByGameIdQueryHandler,
					},
					Command: {
						SyncGameClassifications: gameLibrary.syncGameClassificationsCommandHandler,
					},
				},
				Query: {
					GetGames: gameLibrary.getGamesQueryHandler,
					GetGamesByIds: gameLibrary.getGamesByIdsQueryHandler,
					GetGenreById: gameLibrary.getGenreByIdQueryHandler,
					GetGenresByIds: gameLibrary.getGenresByIdsQueryHandler,
					GetCompaniesByIds: gameLibrary.getCompaniesByIdsQueryHandler,
					GetPlatformsByIds: gameLibrary.getPlatformsByIdsQueryHandler,
					GetCompletionStatusesByIds: gameLibrary.getCompletionStatusesByIdsQueryHandler,
					GetGameLibraryFilters: gameLibrary.getGameLibraryFiltersQueryHandler,
				},
				Command: {
					SyncGames: gameLibrary.syncGamesCommandHandler,
					SyncGenres: gameLibrary.syncGenresCommandHandler,
					SyncCompanies: gameLibrary.syncCompaniesCommandHandler,
					SyncPlatforms: gameLibrary.syncPlatformsCommandHandler,
					SyncCompletionStatuses: gameLibrary.syncCompletionStatusesCommandHandler,
					CreateGameLibraryFilter: gameLibrary.createGameLibraryFilterCommandHandler,
				},
				SyncManager: gameLibrary.gameLibrarySyncManager,
				SyncProgressReporter: gameLibrary.syncProgressReporter,
			},
			GameSession: {
				GameSessionReadonlyStore: gameSession.gameSessionReadonlyStore,
			},
			Auth: {
				Flow: auth.authFlow,
			},
			EventBus: eventBus,
		};

		return Object.freeze(api);
	}
}
