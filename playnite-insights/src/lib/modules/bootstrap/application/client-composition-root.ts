import {
	HttpClient,
	LogService,
	type IHttpClientPort,
	type ILogServicePort,
} from "$lib/modules/common/application";
import {
	companyRepositorySchema,
	gameRepositorySchema,
	genreRepositorySchema,
	platformRepositorySchema,
} from "$lib/modules/game-library/infra";
import {
	ClientGameLibraryModule,
	ClientInfraModule,
	type IClientGameLibraryModulePort,
	type IClientInfraModulePort,
} from "../modules";
import type { ClientApi } from "./client-api.svelte";
import { ClientBootstrapper } from "./client-bootstrapper";

export class ClientCompositionRoot {
	private readonly logService: ILogServicePort;
	private readonly playAtlasHttpClient: IHttpClientPort;

	constructor() {
		this.logService = new LogService();
		this.playAtlasHttpClient = new HttpClient({
			getHeaders: () => new Headers(),
			url: window.origin,
		});
	}

	buildAsync = async (): Promise<ClientApi> => {
		const infra: IClientInfraModulePort = new ClientInfraModule({
			logService: this.logService,
			schemas: [
				gameRepositorySchema,
				genreRepositorySchema,
				companyRepositorySchema,
				platformRepositorySchema,
			],
		});
		await infra.initializeAsync();

		const gameLibrary: IClientGameLibraryModulePort = new ClientGameLibraryModule({
			dbSignal: infra.dbSignal,
			httpClient: this.playAtlasHttpClient,
			clock: infra.clock,
		});

		const bootstrapper = new ClientBootstrapper({ modules: { infra, gameLibrary } });
		return bootstrapper.bootstrap();
	};
}
