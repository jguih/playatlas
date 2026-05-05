import { makeEventBus } from "@playatlas/common/application";
import type { AppEnvironmentVariables } from "@playatlas/common/infra";
import { makeTestHorrorScoreEngine } from "@playatlas/game-library/testing";
import { makeLogServiceFactory } from "@playatlas/system/application";
import { bootstrapV1, type PlayAtlasApiV1 } from "../application";
import {
	makeAuthModule,
	makeGameLibraryModule,
	makeJobQueueModule,
	makeSystemModule,
} from "../application/modules";
import { makeGameSessionModule } from "../application/modules/game-session.module";
import { makeInfraModule } from "../application/modules/infra.module";
import { makePlayniteIntegrationModule } from "../application/modules/playnite-integration.module";
import { makeSeedDataModule } from "./modules/seed-data.module";
import { makeTestFactoryModule } from "./modules/test-factory.module";
import { bootstrapTestApiV1 } from "./test-bootstrap.service";
import { makeTestClock } from "./test-clock";
import type { TestDoubleServices } from "./test.api.types";
import type { PlayAtlasTestApiV1 } from "./test.api.v1";

export type TestCompositionRootDeps = {
	env: AppEnvironmentVariables;
};

export type ITestRootPort = {
	buildAsync: () => Promise<{ api: PlayAtlasApiV1; testApi: PlayAtlasTestApiV1 }>;
};

export const makeTestCompositionRoot = ({ env }: TestCompositionRootDeps): ITestRootPort => {
	const _build_base_deps = () => {
		const system = makeSystemModule({ env });

		const logServiceFactory = makeLogServiceFactory({
			getCurrentLogLevel: () => system.getSystemConfig().getLogLevel(),
		});
		const logService = logServiceFactory.build("SvelteBackend");

		const eventBus = makeEventBus({
			logService: logServiceFactory.build("EventBus"),
		});

		const clock = makeTestClock();

		return { system, logServiceFactory, logService, eventBus, clock };
	};

	const _build_test_double_services = (): TestDoubleServices => {
		const testHorrorScoreEngine = makeTestHorrorScoreEngine();

		return {
			gameLibrary: { scoreEngine: { horror: testHorrorScoreEngine } },
		};
	};

	const buildAsync: ITestRootPort["buildAsync"] = async () => {
		const { clock, eventBus, logService, logServiceFactory, system } = _build_base_deps();
		const testDoubleServices = _build_test_double_services();

		const infra = makeInfraModule({
			logServiceFactory,
			envService: system.getEnvService(),
			systemConfig: system.getSystemConfig(),
		});
		await infra.initEnvironment();
		await infra.initDb();

		const baseDeps = { getDb: infra.getDb, logServiceFactory, eventBus, clock };

		const gameLibrary = makeGameLibraryModule({
			...baseDeps,
			fileSystemService: infra.getFsService(),
			systemConfig: system.getSystemConfig(),
			scoreEngine: {
				engineOverride: {
					HORROR: testDoubleServices.gameLibrary.scoreEngine.horror,
				},
			},
		});

		const auth = makeAuthModule({
			...baseDeps,
			signatureService: infra.getSignatureService(),
		});

		const testFactory = makeTestFactoryModule({
			companyFactory: gameLibrary.getCompanyFactory(),
			completionStatusFactory: gameLibrary.getCompletionStatusFactory(),
			platformFactory: gameLibrary.getPlatformFactory(),
			genreFactory: gameLibrary.getGenreFactory(),
			tagFactory: gameLibrary.getTagFactory(),
			extensionRegistrationFactory: auth.getExtensionRegistrationFactory(),
			clock,
			gameFactory: gameLibrary.getGameFactory(),
			gameMapper: gameLibrary.getGameMapper(),
		});
		testFactory.init();

		const playniteIntegration = makePlayniteIntegrationModule({
			...baseDeps,
			fileSystemService: infra.getFsService(),
			systemConfig: system.getSystemConfig(),
			gameRepository: gameLibrary.getGameRepository(),
			gameAssetsContextFactory: gameLibrary.getGameAssetsContextFactory(),
			gameLibraryUnitOfWork: gameLibrary.getGameLibraryUnitOfWork(),
		});
		await playniteIntegration.getLibraryManifestService().write();

		const gameSession = makeGameSessionModule({
			...baseDeps,
			gameRepository: gameLibrary.getGameRepository(),
		});

		const jobQueue = makeJobQueueModule({ ...baseDeps });

		const seedData = makeSeedDataModule({ gameLibrary });

		const api = bootstrapV1({
			backendLogService: logService,
			eventBus,
			modules: {
				auth,
				gameLibrary,
				gameSession,
				infra,
				playniteIntegration,
				system,
				jobQueue,
			},
		});

		const testApi = bootstrapTestApiV1({
			backendLogService: logService,
			eventBus,
			modules: {
				gameLibrary,
				infra,
				system,
				seedData,
				testFactory,
			},
			clock,
			testDoubleServices,
		});

		return { api, testApi };
	};

	return {
		buildAsync,
	};
};
