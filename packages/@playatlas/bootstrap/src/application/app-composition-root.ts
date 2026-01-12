import { makeEventBus } from "@playatlas/common/application";
import type { AppEnvironmentVariables } from "@playatlas/common/common";
import { makeLogServiceFactory } from "@playatlas/system/application";
import { bootstrapV1 } from "./bootstrap.service";
import type { PlayAtlasApiV1 } from "./bootstrap.service.types";
import {
  makeAuthModule,
  makeGameLibraryModule,
  makeSystemModule,
} from "./modules";
import { makeGameSessionModule } from "./modules/game-session.module";
import { makeInfraModule } from "./modules/infra.module";
import type { IInfraModulePort } from "./modules/infra.module.port";
import { makePlayniteIntegrationModule } from "./modules/playnite-integration.module";

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
    infra: IInfraModulePort;
  };
};

export const makeAppCompositionRoot = ({
  env,
}: AppCompositionRootDeps): AppRoot => {
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

  const initEnvironmentAsync = async () => {
    backendLogService.info("Initializing environment");
    await infra.initEnvironment();
    backendLogService.info("Initializing database");
    await infra.initDb();
    await playniteIntegration.getLibraryManifestService().write();
  };

  const buildAsync = async (): Promise<PlayAtlasApiV1> => {
    const eventBus = makeEventBus({
      logService: logServiceFactory.build("EventBus"),
    });

    const auth = makeAuthModule({
      ...baseDeps,
      signatureService: infra.getSignatureService(),
    });

    const gameSession = makeGameSessionModule({
      ...baseDeps,
      gameRepository: gameLibrary.getGameRepository(),
    });

    await initEnvironmentAsync();

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
      infra,
    },
  };
};
