import type { IClientGameLibraryModulePort } from '../modules/game-library.module.port';
import type { IClientInfraModulePort } from '../modules/infra.module.port';
import type { ClientApi } from './client-api.svelte';

export type ClientModules = {
	infra: IClientInfraModulePort;
	gameLibrary: IClientGameLibraryModulePort;
};

export type ClientBootstrapperDeps = {
	modules: ClientModules;
};

export class ClientBootstrapper {
	readonly infra: IClientInfraModulePort;
	readonly gameLibrary: IClientGameLibraryModulePort;

	constructor({ modules }: ClientBootstrapperDeps) {
		this.infra = modules.infra;
		this.gameLibrary = modules.gameLibrary;
	}

	bootstrap(): ClientApi {
		const api: ClientApi = {
			GetGamesQueryHandler: this.gameLibrary.getGamesQueryHandler,
		};

		return Object.freeze(api);
	}
}
