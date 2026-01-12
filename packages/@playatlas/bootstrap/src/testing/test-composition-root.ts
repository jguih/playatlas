import { makeEventBus } from "@playatlas/common/application";
import type { AppEnvironmentVariables } from "@playatlas/common/common";
import { Company, Game, Genre, Platform } from "@playatlas/game-library/domain";
import { makeGameFactory } from "@playatlas/game-library/testing";
import { makeLogServiceFactory } from "@playatlas/system/application";
import { type PlayAtlasApi, bootstrap } from "../application";
import {
  makeAuthModule,
  makeGameLibraryModule,
  makeSystemModule,
} from "../application/modules";
import { makeGameSessionModule } from "../application/modules/game-session.module";
import { makeInfraModule } from "../application/modules/infra.module";
import { makePlayniteIntegrationModule } from "../application/modules/playnite-integration.module";
import {
  type ITestFactoryModulePort,
  makeTestFactoryModule,
} from "./test-factory.module";

export type TestCompositionRootDeps = {
  env: AppEnvironmentVariables;
};

export type TestRoot = {
  buildAsync: () => Promise<PlayAtlasApi>;
  cleanup: () => Promise<void>;
  factory: ITestFactoryModulePort;
  seedCompany: (company: Company | Company[]) => void;
  seedGames: (game: Game | Game[]) => void;
  seedGenre: (genre: Genre | Genre[]) => void;
  seedPlatform: (platform: Platform | Platform[]) => void;
  resetDbAsync: () => Promise<void>;
};

export const makeTestCompositionRoot = ({
  env,
}: TestCompositionRootDeps): TestRoot => {
  const system = makeSystemModule({ env });

  const logServiceFactory = makeLogServiceFactory({
    getCurrentLogLevel: () => system.getSystemConfig().getLogLevel(),
  });
  const backendLogService = logServiceFactory.build("SvelteBackend");

  const infra = makeInfraModule({
    logServiceFactory,
    envService: system.getEnvService(),
    systemConfig: system.getSystemConfig(),
  });

  const baseDeps = { getDb: infra.getDb, logServiceFactory };

  const gameLibrary = makeGameLibraryModule({ ...baseDeps });

  const factory = makeTestFactoryModule();

  const setupGameFactoryAsync = async () => {
    const completionStatusList = factory
      .getCompletionStatusFactory()
      .buildDefaultCompletionStatusList();
    const companyList = factory.getCompanyFactory().buildList(200);
    const genreList = factory.getGenreFactory().buildList(200);
    const platformList = factory.getPlatformFactory().buildList(30);

    gameLibrary.getCompletionStatusRepository().upsert(completionStatusList);
    gameLibrary.getCompanyRepository().upsert(companyList);
    gameLibrary.getGenreRepository().upsert(genreList);
    gameLibrary.getPlatformRepository().upsert(platformList);

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
      })
    );
  };

  const buildAsync = async (): Promise<PlayAtlasApi> => {
    backendLogService.info("Initializing environment");
    await infra.initEnvironment();
    backendLogService.info("Initializing database");
    await infra.initDb();

    const eventBus = makeEventBus({
      logService: logServiceFactory.build("EventBus"),
    });

    const auth = makeAuthModule({
      ...baseDeps,
      signatureService: infra.getSignatureService(),
    });

    const playniteIntegration = makePlayniteIntegrationModule({
      ...baseDeps,
      fileSystemService: infra.getFsService(),
      systemConfig: system.getSystemConfig(),
      gameRepository: gameLibrary.getGameRepository(),
      companyRepository: gameLibrary.getCompanyRepository(),
      completionStatusRepository: gameLibrary.getCompletionStatusRepository(),
      genreRepository: gameLibrary.getGenreRepository(),
      platformRepository: gameLibrary.getPlatformRepository(),
    });

    const gameSession = makeGameSessionModule({
      ...baseDeps,
      gameRepository: gameLibrary.getGameRepository(),
    });

    await setupGameFactoryAsync();

    return bootstrap({
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
    backendLogService.warning(
      `Deleting integration test work dir at ${workDir}`
    );
    await infra.getFsService().rm(workDir, { force: true, recursive: true });
  };

  const seedCompany = (company: Company | Company[]) => {
    gameLibrary.getCompanyRepository().upsert(company);
  };

  const seedGames = (game: Game | Game[]) => {
    gameLibrary.getGameRepository().upsert(game);
  };

  const seedGenre = (genre: Genre | Genre[]) => {
    gameLibrary.getGenreRepository().upsert(genre);
  };

  const seedPlatform = (platform: Platform | Platform[]) => {
    gameLibrary.getPlatformRepository().upsert(platform);
  };

  const resetDbAsync = async () => {
    infra.getDb().close();
    await infra.initDb();
    await setupGameFactoryAsync();
  };

  return {
    buildAsync,
    factory,
    cleanup,
    seedCompany,
    seedGames,
    seedGenre,
    seedPlatform,
    resetDbAsync,
  };
};
