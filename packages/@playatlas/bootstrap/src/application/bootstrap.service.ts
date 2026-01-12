import { DomainEventBus, ILogServicePort } from "@playatlas/common/application";
import { type PlayAtlasApiV1 } from "./bootstrap.service.types";
import {
  IAuthModulePort,
  IGameLibraryModulePort,
  ISystemModulePort,
} from "./modules";
import { IGameSessionModulePort } from "./modules/game-session.module.port";
import { IInfraModulePort } from "./modules/infra.module.port";
import { IPlayniteIntegrationModulePort } from "./modules/playnite-integration.module.port";

export type BootstrapDeps = {
  modules: {
    infra: IInfraModulePort;
    gameLibrary: IGameLibraryModulePort;
    auth: IAuthModulePort;
    gameSession: IGameSessionModulePort;
    system: ISystemModulePort;
    playniteIntegration: IPlayniteIntegrationModulePort;
  };
  backendLogService: ILogServicePort;
  eventBus: DomainEventBus;
};

export const bootstrapV1 = ({
  modules: {
    auth,
    gameLibrary,
    gameSession,
    infra,
    system,
    playniteIntegration,
  },
  backendLogService,
  eventBus,
}: BootstrapDeps): PlayAtlasApiV1 => {
  const api: PlayAtlasApiV1 = {
    system: {
      getSystemConfig: system.getSystemConfig,
    },
    gameLibrary: {
      queries: {
        getGetAllGamesQueryHandler:
          gameLibrary.queries.getGetAllGamesQueryHandler,
        getGetAllCompaniesQueryHandler:
          gameLibrary.queries.getGetAllCompaniesQueryHandler,
        getGetAllPlatformsQueryHandler:
          gameLibrary.queries.getGetAllPlatformsQueryHandler,
        getGetAllGenresQueryHandler:
          gameLibrary.queries.getGetAllGenresQueryHandler,
      },
    },
    auth: {
      getExtensionAuthService: auth.getExtensionAuthService,
      getCryptographyService: auth.getCryptographyService,
      getInstanceAuthService: auth.getInstanceAuthService,
      commands: {
        getApproveExtensionRegistrationCommandHandler:
          auth.commands.getApproveExtensionRegistrationCommandHandler,
        getRejectExtensionRegistrationCommandHandler:
          auth.commands.getRejectExtensionRegistrationCommandHandler,
        getRevokeExtensionRegistrationCommandHandler:
          auth.commands.getRejectExtensionRegistrationCommandHandler,
        getRemoveExtensionRegistrationCommandHandler:
          auth.commands.getRemoveExtensionRegistrationCommandHandler,
      },
      queries: {
        getGetAllExtensionRegistrationsQueryHandler:
          auth.queries.getGetAllExtensionRegistrationsQueryHandler,
      },
    },
    playniteIntegration: {
      getPlayniteMediaFilesHandler:
        playniteIntegration.getPlayniteMediaFilesHandler,
      getLibraryManifestService: playniteIntegration.getLibraryManifestService,
      getPlayniteSyncService: playniteIntegration.getPlayniteSyncService,
      commands: {
        getSyncGamesCommandHandler:
          playniteIntegration.commands.getSyncGamesCommandHandler,
      },
    },
    gameSession: {
      commands: {
        getOpenGameSessionCommandHandler:
          gameSession.commands.getOpenGameSessionCommandHandler,
        getCloseGameSessionCommandHandler:
          gameSession.commands.getCloseGameSessionCommandHandler,
        getStaleGameSessionCommandHandler:
          gameSession.commands.getStaleGameSessionCommandHandler,
      },
    },
    getLogService: () => backendLogService,
    eventBus,
  };

  return Object.freeze(api);
};
