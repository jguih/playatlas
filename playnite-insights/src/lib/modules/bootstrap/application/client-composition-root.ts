import { sessionIdRepositorySchema } from "$lib/modules/auth/infra";
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
				sessionIdRepositorySchema,
			],
		});
		await infra.initializeAsync();

		const authHttpClient = new HttpClient({ url: window.origin });
		const auth: IAuthModulePort = new AuthModule({
			httpClient: authHttpClient,
			dbSignal: infra.dbSignal,
			clock: infra.clock,
			logService: this.logService,
		});
		await auth.initializeAsync();

		const playAtlasHttpClient = new AuthenticatedHttpClient({
			httpClient: new HttpClient({ url: window.origin }),
			sessionIdProvider: auth.sessionIdProvider,
		});
		const gameLibrary: IClientGameLibraryModulePort = new ClientGameLibraryModule({
			dbSignal: infra.dbSignal,
			httpClient: playAtlasHttpClient,
			clock: infra.clock,
		});

		const bootstrapper = new ClientBootstrapper({ modules: { infra, gameLibrary, auth } });
		return bootstrapper.bootstrap();
	};
}
