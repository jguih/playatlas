import { makeEventBus } from "@playatlas/common/application";
import type { AppEnvironmentVariables } from "@playatlas/common/common";
import type {
	Company,
	CompletionStatus,
	Game,
	Genre,
	Platform,
} from "@playatlas/game-library/domain";
import { makeGameFactory } from "@playatlas/game-library/testing";
import { makeLogServiceFactory } from "@playatlas/system/application";
import { bootstrapV1, type PlayAtlasApiV1 } from "../application";
import { makeAuthModule, makeGameLibraryModule, makeSystemModule } from "../application/modules";
import { makeGameSessionModule } from "../application/modules/game-session.module";
import { makeInfraModule } from "../application/modules/infra.module";
import { makePlayniteIntegrationModule } from "../application/modules/playnite-integration.module";
import { makeTestClock, type TestClock } from "./test-clock";
import { type ITestFactoryModulePort, makeTestFactoryModule } from "./test-factory.module";

export type TestCompositionRootDeps = {
	env: AppEnvironmentVariables;
};

export type TestRoot = {
	buildAsync: () => Promise<PlayAtlasApiV1>;
	cleanup: () => Promise<void>;
	factory: ITestFactoryModulePort;
	seedCompany: (company: Company | Company[]) => void;
	seedGame: (game: Game | Game[]) => void;
	seedGenre: (genre: Genre | Genre[]) => void;
	seedPlatform: (platform: Platform | Platform[]) => void;
	seedCompletionStatus: (completionStatus: CompletionStatus | CompletionStatus[]) => void;
	seedGameRelationships: () => void;
	gameRelationshipOptions: {
		completionStatusList: CompletionStatus[];
		companyList: Company[];
		genreList: Genre[];
		platformList: Platform[];
	};
	resetDbAsync: () => Promise<void>;
	clock: TestClock;
};

export const makeTestCompositionRoot = ({ env }: TestCompositionRootDeps): TestRoot => {
	const system = makeSystemModule({ env });

	const logServiceFactory = makeLogServiceFactory({
		getCurrentLogLevel: () => system.getSystemConfig().getLogLevel(),
	});
	const backendLogService = logServiceFactory.build("SvelteBackend");

	const eventBus = makeEventBus({
		logService: logServiceFactory.build("EventBus"),
	});

	const clock = makeTestClock();

	const infra = makeInfraModule({
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

	const auth = makeAuthModule({
		...baseDeps,
		signatureService: infra.getSignatureService(),
	});

	const factory = makeTestFactoryModule({
		companyFactory: gameLibrary.getCompanyFactory(),
		completionStatusFactory: gameLibrary.getCompletionStatusFactory(),
		platformFactory: gameLibrary.getPlatformFactory(),
		genreFactory: gameLibrary.getGenreFactory(),
		extensionRegistrationFactory: auth.getExtensionRegistrationFactory(),
	});

	const gameRelationshipOptions = {
		completionStatusList: factory.getCompletionStatusFactory().buildDefaultList(),
		companyList: factory.getCompanyFactory().buildList(200),
		genreList: factory.getGenreFactory().buildList(200),
		platformList: factory.getPlatformFactory().buildList(30),
	};

	const setupGameFactory = () => {
		const { companyList, completionStatusList, genreList, platformList } = gameRelationshipOptions;

		const completionStatusOptions = completionStatusList.map((c) => c.getId());
		const companyOptions = companyList.map((c) => c.getId());
		const genreOptions = genreList.map((g) => g.getId());
		const platformOptions = platformList.map((p) => p.getId());

		factory.setGameFactory(
			makeGameFactory({
				companyOptions,
				completionStatusOptions,
				genreOptions,
				platformOptions,
				gameFactory: gameLibrary.getGameFactory(),
				gameMapper: gameLibrary.getGameMapper(),
			}),
		);
	};

	const buildAsync = async (): Promise<PlayAtlasApiV1> => {
		backendLogService.info("Initializing environment");
		await infra.initEnvironment();
		backendLogService.info("Initializing database");
		await infra.initDb();

		const playniteIntegration = makePlayniteIntegrationModule({
			...baseDeps,
			fileSystemService: infra.getFsService(),
			systemConfig: system.getSystemConfig(),
			gameRepository: gameLibrary.getGameRepository(),
			gameAssetsContextFactory: gameLibrary.getGameAssetsContextFactory(),
			gameLibraryUnitOfWork: gameLibrary.getGameLibraryUnitOfWork(),
		});

		const gameSession = makeGameSessionModule({
			...baseDeps,
			gameRepository: gameLibrary.getGameRepository(),
		});

		setupGameFactory();

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

	const cleanup = async () => {
		const workDir = system.getEnvService().getWorkDir();
		backendLogService.warning(`Deleting integration test work dir at ${workDir}`);
		await infra.getFsService().rm(workDir, { force: true, recursive: true });
	};

	const seedCompany = (company: Company | Company[]) => {
		gameLibrary.getCompanyRepository().upsert(company);
	};

	const seedGame = (game: Game | Game[]) => {
		gameLibrary.getGameRepository().upsert(game);
	};

	const seedGenre = (genre: Genre | Genre[]) => {
		gameLibrary.getGenreRepository().upsert(genre);
	};

	const seedPlatform = (platform: Platform | Platform[]) => {
		gameLibrary.getPlatformRepository().upsert(platform);
	};

	const seedCompletionStatus = (completionStatus: CompletionStatus | CompletionStatus[]) => {
		gameLibrary.getCompletionStatusRepository().upsert(completionStatus);
	};

	const seedGameRelationships = () => {
		const { companyList, completionStatusList, genreList, platformList } = gameRelationshipOptions;

		gameLibrary.getCompletionStatusRepository().upsert(completionStatusList);
		gameLibrary.getCompanyRepository().upsert(companyList);
		gameLibrary.getGenreRepository().upsert(genreList);
		gameLibrary.getPlatformRepository().upsert(platformList);
	};

	const resetDbAsync = async () => {
		infra.getDb().close();
		await infra.initDb();
	};

	return {
		buildAsync,
		factory,
		cleanup,
		seedCompany,
		seedGame,
		seedGenre,
		seedPlatform,
		seedCompletionStatus,
		seedGameRelationships,
		gameRelationshipOptions,
		resetDbAsync,
		clock,
	};
};
