import { sessionIdRepositorySchema } from "$lib/modules/auth/infra";
import {
	AuthenticatedHttpClient,
	EventBus,
	HttpClient,
	LogService,
	type IClockPort,
	type IDomainEventBusPort,
	type ILogServicePort,
} from "$lib/modules/common/application";
import { Clock } from "$lib/modules/common/infra";
import {
	companyRepositorySchema,
	completionStatusRepositorySchema,
	gameClassificationRepositorySchema,
	gameLibraryFilterRepositorySchema,
	gameRepositorySchema,
	gameVectorStoreSchema,
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
import type { ClientApiV1 } from "./client-api.v1";
import { ClientBootstrapper } from "./client-bootstrapper";

export class ClientCompositionRoot {
	private readonly logService: ILogServicePort = new LogService();
	private readonly eventBus: IDomainEventBusPort = new EventBus();
	private readonly clock: IClockPort = new Clock();

	constructor() {}

	buildAsync = async (): Promise<ClientApiV1> => {
		const infra: IClientInfraModulePort = new ClientInfraModule({
			logService: this.logService,
			schemas: [
				gameRepositorySchema,
				genreRepositorySchema,
				companyRepositorySchema,
				platformRepositorySchema,
				sessionIdRepositorySchema,
				completionStatusRepositorySchema,
				gameLibraryFilterRepositorySchema,
				gameClassificationRepositorySchema,
				gameVectorStoreSchema,
			],
			clock: this.clock,
		});
		await infra.initializeAsync();

		const authHttpClient = new HttpClient({ url: window.origin });
		const auth: IAuthModulePort = new AuthModule({
			httpClient: authHttpClient,
			dbSignal: infra.dbSignal,
			clock: this.clock,
			logService: this.logService,
			eventBus: this.eventBus,
		});
		await auth.initializeAsync();

		const playAtlasHttpClient = new AuthenticatedHttpClient({
			httpClient: new HttpClient({ url: window.origin }),
			sessionIdProvider: auth.sessionIdProvider,
		});
		const gameLibrary: IClientGameLibraryModulePort = new ClientGameLibraryModule({
			dbSignal: infra.dbSignal,
			httpClient: playAtlasHttpClient,
			clock: this.clock,
			eventBus: this.eventBus,
		});

		this.startLibrarySync({ auth, gameLibrary });
		this.setupDomainEventListeners({ auth, gameLibrary });

		const bootstrapper = new ClientBootstrapper({
			modules: { infra, gameLibrary, auth },
			eventBus: this.eventBus,
		});
		return bootstrapper.bootstrap();
	};

	private startLibrarySync = (deps: {
		auth: IAuthModulePort;
		gameLibrary: IClientGameLibraryModulePort;
	}) => {
		void deps.auth.sessionIdProvider.getAsync().then((sessionId) => {
			if (sessionId) {
				void deps.gameLibrary.gameLibrarySyncManager.executeAsync();
			}
		});
	};

	private setupDomainEventListeners = (deps: {
		auth: IAuthModulePort;
		gameLibrary: IClientGameLibraryModulePort;
	}) => {
		this.eventBus.on("login-successful", () => {
			this.startLibrarySync(deps);
		});
	};
}
