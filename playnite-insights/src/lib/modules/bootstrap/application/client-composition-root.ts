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
import { PlayAtlasClient } from "$lib/modules/common/application/playatlas-client";
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
import { gameSessionStoreSchema } from "$lib/modules/game-session/infra";
import { SyncRunner } from "$lib/modules/synchronization/application/sync-runner";
import {
	ClientGameLibraryModule,
	ClientInfraModule,
	GameSessionModule,
	SynchronizationModule,
	type IClientGameLibraryModulePort,
	type IClientGameSessionModulePort,
	type IClientInfraModulePort,
	type ISynchronizationModulePort,
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
				gameSessionStoreSchema,
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
		const playAtlasClient = new PlayAtlasClient({ httpClient: playAtlasHttpClient });
		const syncRunner = new SyncRunner({ clock: this.clock, syncState: infra.playAtlasSyncState });

		const gameSession: IClientGameSessionModulePort = new GameSessionModule({
			clock: this.clock,
			dbSignal: infra.dbSignal,
			logService: this.logService,
			playAtlasClient,
			syncRunner,
		});

		const gameLibrary: IClientGameLibraryModulePort = new ClientGameLibraryModule({
			dbSignal: infra.dbSignal,
			playAtlasClient,
			clock: this.clock,
			syncRunner,
			gameSessionReadonlyStore: gameSession.gameSessionReadonlyStore,
			gameVectorReadonlyStore: infra.gameVectorReadonlyStore,
			gameVectorWriteStore: infra.gameVectorWriteStore,
		});

		const synchronization = new SynchronizationModule({
			clock: this.clock,
			eventBus: this.eventBus,
			syncCompaniesFlow: gameLibrary.syncCompaniesFlow,
			syncCompletionStatusesFlow: gameLibrary.syncCompletionStatusesFlow,
			syncGameClassificationsFlow: gameLibrary.syncGameClassificationsFlow,
			syncGamesFlow: gameLibrary.syncGamesFlow,
			syncGenresFlow: gameLibrary.syncGenresFlow,
			syncPlatformsFlow: gameLibrary.syncPlatformsFlow,
			syncGameSessionsFlow: gameSession.syncGameSessionsFlow,
		});

		this.startLibrarySync({ auth, synchronization });
		this.setupDomainEventListeners({ auth, synchronization });

		const bootstrapper = new ClientBootstrapper({
			modules: { infra, gameLibrary, auth, gameSession, synchronization },
			eventBus: this.eventBus,
		});
		return bootstrapper.bootstrap();
	};

	private startLibrarySync = (deps: {
		auth: IAuthModulePort;
		synchronization: ISynchronizationModulePort;
	}) => {
		void deps.auth.sessionIdProvider.getAsync().then((sessionId) => {
			if (sessionId) {
				void deps.synchronization.syncManager.executeAsync();
			}
		});
	};

	private setupDomainEventListeners = (deps: {
		auth: IAuthModulePort;
		synchronization: ISynchronizationModulePort;
	}) => {
		this.eventBus.on("login-successful", () => {
			this.startLibrarySync(deps);
		});
	};
}
