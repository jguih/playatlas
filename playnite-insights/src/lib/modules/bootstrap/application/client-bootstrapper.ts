import type { IAuthModulePort } from "../modules/auth.module.port";
import type { IClientGameLibraryModulePort } from "../modules/game-library.module.port";
import type { IClientInfraModulePort } from "../modules/infra.module.port";
import type { ClientApi } from "./client-api";

export type ClientModules = {
	infra: IClientInfraModulePort;
	gameLibrary: IClientGameLibraryModulePort;
	auth: IAuthModulePort;
};

export type ClientBootstrapperDeps = {
	modules: ClientModules;
};

export class ClientBootstrapper {
	private readonly infra: IClientInfraModulePort;
	private readonly gameLibrary: IClientGameLibraryModulePort;
	private readonly auth: IAuthModulePort;

	constructor({ modules }: ClientBootstrapperDeps) {
		this.infra = modules.infra;
		this.gameLibrary = modules.gameLibrary;
		this.auth = modules.auth;
	}

	bootstrap(): ClientApi {
		const api: ClientApi = {
			GameLibrary: {
				Query: {
					GetGames: this.gameLibrary.getGamesQueryHandler,
					GetGamesByIds: this.gameLibrary.getGamesByIdsQueryHandler,
					GetGenreById: this.gameLibrary.getGenreByIdQueryHandler,
					GetGenresByIds: this.gameLibrary.getGenresByIdsQueryHandler,
					GetCompaniesByIds: this.gameLibrary.getCompaniesByIdsQueryHandler,
					GetPlatformsByIds: this.gameLibrary.getPlatformsByIdsQueryHandler,
				},
				Command: {
					SyncGames: this.gameLibrary.syncGamesCommandHandler,
					SyncGenres: this.gameLibrary.syncGenresCommandHandler,
					SyncCompanies: this.gameLibrary.syncCompaniesCommandHandler,
					SyncPlatforms: this.gameLibrary.syncPlatformsCommandHandler,
				},
				SyncGamesFlow: this.gameLibrary.syncGamesFlow,
			},
			Auth: {
				Flow: this.auth.authFlow,
			},
		};

		return Object.freeze(api);
	}
}
