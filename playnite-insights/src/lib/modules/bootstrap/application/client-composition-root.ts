import {
	AuthenticatedHttpClient,
	HttpClient,
	LogService,
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
import { AuthModule } from "../modules/auth.module";
import type { IAuthModulePort } from "../modules/auth.module.port";
import type { ClientApi } from "./client-api";
import { ClientBootstrapper } from "./client-bootstrapper";

export class ClientCompositionRoot {
	private readonly logService: ILogServicePort;

	constructor() {
		this.logService = new LogService();
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

		const playAtlasHttpClient = new AuthenticatedHttpClient({
			httpClient: new HttpClient({ url: window.origin }),
		});
		const gameLibrary: IClientGameLibraryModulePort = new ClientGameLibraryModule({
			dbSignal: infra.dbSignal,
			httpClient: playAtlasHttpClient,
			clock: infra.clock,
		});

		const authHttpClient = new HttpClient({ url: window.origin });
		const auth: IAuthModulePort = new AuthModule({ httpClient: authHttpClient });

		const bootstrapper = new ClientBootstrapper({ modules: { infra, gameLibrary, auth } });
		return bootstrapper.bootstrap();
	};
}
