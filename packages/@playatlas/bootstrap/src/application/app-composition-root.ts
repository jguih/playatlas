import { makeEventBus, type ILogServicePort } from "@playatlas/common/application";
import { makeClock, type AppEnvironmentVariables } from "@playatlas/common/infra";
import { makeLogServiceFactory } from "@playatlas/system/application";
import { bootstrapV1 } from "./bootstrap.service";
import {
	makeAuthModule,
	makeGameLibraryModule,
	makeSystemModule,
	type IGameLibraryModulePort,
	type IPlayniteIntegrationModulePort,
} from "./modules";
import { makeGameSessionModule } from "./modules/game-session.module";
import { makeInfraModule } from "./modules/infra.module";
import type { IInfraModulePort } from "./modules/infra.module.port";
import { makePlayniteIntegrationModule } from "./modules/playnite-integration.module";
import type { PlayAtlasApiV1 } from "./playatlas.api.v1";

export type AppCompositionRootDeps = {
	env: AppEnvironmentVariables;
};

export type AppRoot = {
	buildAsync: () => Promise<PlayAtlasApiV1>;
	/**
	 * Used for compatibility with old API.
	 * Will be removed with old API.
	 * @deprecated
	 */
	unsafe: {
		getInfra: () => IInfraModulePort;
	};
};

export const makeAppCompositionRoot = ({ env }: AppCompositionRootDeps): AppRoot => {
	let infra: IInfraModulePort;

	const initEnvironmentAsync = async (props: {
		logService: ILogServicePort;
		infra: IInfraModulePort;
		playniteIntegration: IPlayniteIntegrationModulePort;
		gameLibrary: IGameLibraryModulePort;
	}) => {
		const { logService, infra, playniteIntegration, gameLibrary } = props;
		logService.info("Initializing environment");
		await infra.initEnvironment();
		logService.info("Initializing database");
		await infra.initDb();
		await playniteIntegration.getLibraryManifestService().write();

		logService.info(`Initializing game library module`);
		gameLibrary.init();
	};

	const buildAsync = async (): Promise<PlayAtlasApiV1> => {
		const system = makeSystemModule({ env });

		const logServiceFactory = makeLogServiceFactory({
			getCurrentLogLevel: () => system.getSystemConfig().getLogLevel(),
		});
		const backendLogService = logServiceFactory.build("SvelteBackend");

		const eventBus = makeEventBus({
			logService: logServiceFactory.build("EventBus"),
		});

		const clock = makeClock();

		infra = makeInfraModule({
			logServiceFactory,
			envService: system.getEnvService(),
			systemConfig: system.getSystemConfig(),
		});

		const baseDeps = { getDb: infra.getDb, logServiceFactory, eventBus, clock };

		const gameLibrary = makeGameLibraryModule({
			...baseDeps,
			fileSystemService: infra.getFsService(),
			systemConfig: system.getSystemConfig(),
		});

		const playniteIntegration = makePlayniteIntegrationModule({
			...baseDeps,
			fileSystemService: infra.getFsService(),
			systemConfig: system.getSystemConfig(),
			gameRepository: gameLibrary.getGameRepository(),
			gameAssetsContextFactory: gameLibrary.getGameAssetsContextFactory(),
			gameLibraryUnitOfWork: gameLibrary.getGameLibraryUnitOfWork(),
		});

		const auth = makeAuthModule({
			...baseDeps,
			signatureService: infra.getSignatureService(),
		});

		const gameSession = makeGameSessionModule({
			...baseDeps,
			gameRepository: gameLibrary.getGameRepository(),
		});

		await initEnvironmentAsync({
			logService: backendLogService,
			infra,
			playniteIntegration,
			gameLibrary,
		});

		return bootstrapV1({
			backendLogService,
			eventBus,
			modules: {
				auth,
				gameLibrary,
				gameSession,
				infra,
				playniteIntegration,
				system,
			},
		});
	};

	return {
		buildAsync,
		unsafe: {
			getInfra: () => infra,
		},
	};
};
