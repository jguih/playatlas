import { ClientApi } from './client-api.svelte';
import type { IClientInfraModulePort } from './modules/bootstrap.infra.types';

export type ClientModules = {
	infra: IClientInfraModulePort;
};

export type ClientBootstrapperDeps = {
	modules: ClientModules;
};

export class ClientBootstrapper {
	readonly infra: IClientInfraModulePort;

	constructor({ modules }: ClientBootstrapperDeps) {
		this.infra = modules.infra;
	}

	bootstrap(): ClientApi {
		const api = new ClientApi();

		return api;
	}
}
