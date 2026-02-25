import { makeEventBus, type ILogServicePort } from "@playatlas/common/application";
import type { AppEnvironmentVariables } from "@playatlas/common/infra";
import type {
	Company,
	CompletionStatus,
	Game,
	Genre,
	Platform,
	Tag,
} from "@playatlas/game-library/domain";
import {
	makeTestGameFactory,
	makeTestHorrorScoreEngine,
	type ITestHorrorScoreEnginePort,
} from "@playatlas/game-library/testing";
import { makeLogServiceFactory } from "@playatlas/system/application";
import { bootstrapV1, type PlayAtlasApiV1 } from "../application";
import {
	makeAuthModule,
	makeGameLibraryModule,
	makeSystemModule,
	type IAuthModulePort,
	type IGameLibraryModulePort,
	type IInfraModulePort,
	type IPlayniteIntegrationModulePort,
	type ISystemModulePort,
} from "../application/modules";
import { makeGameSessionModule } from "../application/modules/game-session.module";
import type { IGameSessionModulePort } from "../application/modules/game-session.module.port";
import { makeInfraModule } from "../application/modules/infra.module";
import { makePlayniteIntegrationModule } from "../application/modules/playnite-integration.module";
import { makeTestClock, type TestClock } from "./test-clock";
import { makeTestFactoryModule, type ITestFactoryModulePort } from "./test-factory.module";
import type { PlayAtlasTestApiV1 } from "./test.api.v1";

export type TestCompositionRootDeps = {
	env: AppEnvironmentVariables;
};

export type TestRoot = {
	buildAsync: () => Promise<PlayAtlasApiV1>;
	cleanup: () => Promise<void>;
	getFactory: () => ITestFactoryModulePort;
	seedCompany: (company: Company | Company[]) => void;
	seedGame: (game: Game | Game[]) => void;
	seedGenre: (genre: Genre | Genre[]) => void;
	seedPlatform: (platform: Platform | Platform[]) => void;
	seedCompletionStatus: (completionStatus: CompletionStatus | CompletionStatus[]) => void;
	seedTags: (tag: Tag | Tag[]) => void;
	seedGameRelationships: () => void;
	seedDefaultClassifications: () => void;
	getGameRelationshipOptions: () => {
		completionStatusList: CompletionStatus[];
		companyList: Company[];
		genreList: Genre[];
		platformList: Platform[];
	};
	testApi: PlayAtlasTestApiV1;
	resetDbAsync: () => Promise<void>;
};

type Self = {
	system: ISystemModulePort;
	infra: IInfraModulePort;
	gameLibrary: IGameLibraryModulePort;
	auth: IAuthModulePort;
	playniteIntegration: IPlayniteIntegrationModulePort;
	gameSession: IGameSessionModulePort;
	backendLogService: ILogServicePort;
	factory: ITestFactoryModulePort;
	gameRelationshipOptions: {
		completionStatusList: CompletionStatus[];
		companyList: Company[];
		genreList: Genre[];
		platformList: Platform[];
		tagList: Tag[];
	};
	clock: TestClock;
	stubs: {
		scoreEngine: { horrorScoreEngine: ITestHorrorScoreEnginePort };
	};
};

export const makeTestCompositionRoot = ({ env }: TestCompositionRootDeps): TestRoot => {
	let self: Self | null = null;

	const withSelf = <T>(fn: (self: Self) => T): T => {
		if (!self) throw new Error("Test root not built. Call buildAsync() first.");
		return fn(self);
	};

	const setupGameFactory = (self: Self) => {
		const { companyList, completionStatusList, genreList, platformList, tagList } =
			self.gameRelationshipOptions;

		const completionStatusOptions = completionStatusList.map((c) => c.getId());
		const companyOptions = companyList.map((c) => c.getId());
		const genreOptions = genreList.map((g) => g.getId());
		const platformOptions = platformList.map((p) => p.getId());
		const tagOptions = tagList.map((t) => t.getId());

		self.factory.setGameFactory(
			makeTestGameFactory({
				companyOptions,
				completionStatusOptions,
				genreOptions,
				platformOptions,
				tagOptions,
				gameFactory: self.gameLibrary.getGameFactory(),
				gameMapper: self.gameLibrary.getGameMapper(),
			}),
		);
	};

	const initEnvironmentAsync = async (self: Self) => {
		self.backendLogService.info("Initializing environment");
		await self.infra.initEnvironment();
		self.backendLogService.info("Initializing database");
		await self.infra.initDb();
		await self.playniteIntegration.getLibraryManifestService().write();
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

		const clock = makeTestClock();

		const infra = makeInfraModule({
			logServiceFactory,
			envService: system.getEnvService(),
			systemConfig: system.getSystemConfig(),
		});

		const baseDeps = { getDb: infra.getDb, logServiceFactory, eventBus, clock };

		const testHorrorScoreEngine = makeTestHorrorScoreEngine();

		const gameLibrary = makeGameLibraryModule({
			...baseDeps,
			fileSystemService: infra.getFsService(),
			systemConfig: system.getSystemConfig(),
			scoreEngine: {
				engineOverride: {
					HORROR: testHorrorScoreEngine,
				},
			},
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
			tagFactory: gameLibrary.getTagFactory(),
			extensionRegistrationFactory: auth.getExtensionRegistrationFactory(),
			clock,
		});

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

		self = {
			auth,
			backendLogService,
			gameLibrary,
			gameSession,
			infra,
			playniteIntegration,
			system,
			factory,
			gameRelationshipOptions: {
				completionStatusList: factory.getCompletionStatusFactory().buildDefaultList(),
				companyList: factory.getCompanyFactory().buildList(200),
				genreList: factory.getGenreFactory().buildList(200),
				platformList: factory.getPlatformFactory().buildList(30),
				tagList: factory.getTagFactory().buildList(1000),
			},
			clock,
			stubs: {
				scoreEngine: { horrorScoreEngine: testHorrorScoreEngine },
			},
		};

		setupGameFactory(self);

		await initEnvironmentAsync(self);

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
		await withSelf(async ({ system, backendLogService, infra }) => {
			const dataDir = system.getEnvService().getDataDir();
			backendLogService.warning(`Deleting integration test data dir at ${dataDir}`);
			await infra.getFsService().rm(dataDir, { force: true, recursive: true });
		});
	};

	const seedCompany = (company: Company | Company[]) => {
		withSelf(({ gameLibrary }) => {
			gameLibrary.getCompanyRepository().upsert(company);
		});
	};

	const seedGame = (game: Game | Game[]) => {
		withSelf(({ gameLibrary }) => {
			gameLibrary.getGameRepository().upsert(game);
		});
	};

	const seedGenre = (genre: Genre | Genre[]) => {
		withSelf(({ gameLibrary }) => {
			gameLibrary.getGenreRepository().upsert(genre);
		});
	};

	const seedPlatform = (platform: Platform | Platform[]) => {
		withSelf(({ gameLibrary }) => {
			gameLibrary.getPlatformRepository().upsert(platform);
		});
	};

	const seedCompletionStatus = (completionStatus: CompletionStatus | CompletionStatus[]) => {
		withSelf(({ gameLibrary }) => {
			gameLibrary.getCompletionStatusRepository().upsert(completionStatus);
		});
	};

	const seedTags = (tag: Tag | Tag[]) => {
		withSelf(({ gameLibrary }) => {
			gameLibrary.getTagRepository().upsert(tag);
		});
	};

	const seedGameRelationships = () => {
		withSelf(({ gameLibrary, gameRelationshipOptions }) => {
			const { companyList, completionStatusList, genreList, platformList, tagList } =
				gameRelationshipOptions;

			gameLibrary.getCompletionStatusRepository().upsert(completionStatusList);
			gameLibrary.getCompanyRepository().upsert(companyList);
			gameLibrary.getGenreRepository().upsert(genreList);
			gameLibrary.getPlatformRepository().upsert(platformList);
			gameLibrary.getTagRepository().upsert(tagList);
		});
	};

	const seedDefaultClassifications = () => {
		withSelf(({ gameLibrary }) => {
			gameLibrary.scoreEngine.commands
				.getApplyDefaultClassificationsCommandHandler()
				.execute({ type: "default" });
		});
	};

	const resetDbAsync = async () => {
		await withSelf(async ({ infra }) => {
			infra.getDb().close();
			await infra.initDb();
		});
	};

	return {
		buildAsync,
		getFactory: () => {
			return withSelf(({ factory }) => factory);
		},
		cleanup,
		seedCompany,
		seedGame,
		seedGenre,
		seedPlatform,
		seedCompletionStatus,
		seedTags,
		seedGameRelationships,
		seedDefaultClassifications,
		getGameRelationshipOptions: () => {
			return withSelf(({ gameRelationshipOptions }) => gameRelationshipOptions);
		},
		resetDbAsync,
		testApi: {
			getClock: () => withSelf(({ clock }) => clock),
			gameLibrary: {
				commands: {
					getApplyDefaultClassificationsCommandHandler: () => {
						return withSelf(({ gameLibrary }) =>
							gameLibrary.scoreEngine.commands.getApplyDefaultClassificationsCommandHandler(),
						);
					},
				},
				scoreEngine: {
					getScoreBreakdownNormalizer: () =>
						withSelf(({ gameLibrary }) => gameLibrary.scoreEngine.getScoreBreakdownNormalizer()),
					getHorrorScoreEngine: () => withSelf(({ stubs }) => stubs.scoreEngine.horrorScoreEngine),

					evidenceExtractors: {
						getRunBasedEvidenceExtractor: () =>
							withSelf(({ gameLibrary }) =>
								gameLibrary.scoreEngine.evidenceExtractors.getRunBasedEvidenceExtractor(),
							),
					},
				},
			},
		},
	};
};
