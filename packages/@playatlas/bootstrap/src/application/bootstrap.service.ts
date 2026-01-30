import type { IDomainEventBusPort, ILogServicePort } from "@playatlas/common/application";
import type { IAuthModulePort, IGameLibraryModulePort, ISystemModulePort } from "./modules";
import { type IGameSessionModulePort } from "./modules/game-session.module.port";
import { type IInfraModulePort } from "./modules/infra.module.port";
import { type IPlayniteIntegrationModulePort } from "./modules/playnite-integration.module.port";
import { type PlayAtlasApiV1 } from "./playatlas.api.v1";

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
	eventBus: IDomainEventBusPort;
};

export const bootstrapV1 = ({
	modules: { auth, gameLibrary, gameSession, system, playniteIntegration },
	backendLogService,
	eventBus,
}: BootstrapDeps): PlayAtlasApiV1 => {
	const api: PlayAtlasApiV1 = {
		system: {
			getSystemConfig: system.getSystemConfig,
		},
		gameLibrary: {
			queries: {
				getGetAllGamesQueryHandler: gameLibrary.queries.getGetAllGamesQueryHandler,
				getGetAllCompaniesQueryHandler: gameLibrary.queries.getGetAllCompaniesQueryHandler,
				getGetAllPlatformsQueryHandler: gameLibrary.queries.getGetAllPlatformsQueryHandler,
				getGetAllGenresQueryHandler: gameLibrary.queries.getGetAllGenresQueryHandler,
				getGetAllCompletionStatusesQueryHandler:
					gameLibrary.queries.getGetAllCompletionStatusesQueryHandler,
			},
			getGameAssetsContextFactory: gameLibrary.getGameAssetsContextFactory,
			getGameAssetsReindexer: gameLibrary.getGameAssetsReindexer,
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
					auth.commands.getRevokeExtensionRegistrationCommandHandler,
				getRemoveExtensionRegistrationCommandHandler:
					auth.commands.getRemoveExtensionRegistrationCommandHandler,
				getRegisterExtensionCommandHandler: auth.commands.getRegisterExtensionCommandHandler,
			},
			queries: {
				getGetAllExtensionRegistrationsQueryHandler:
					auth.queries.getGetAllExtensionRegistrationsQueryHandler,
			},
		},
		playniteIntegration: {
			getPlayniteMediaFilesHandler: playniteIntegration.getPlayniteMediaFilesHandler,
			getLibraryManifestService: playniteIntegration.getLibraryManifestService,
			getPlayniteSyncService: playniteIntegration.getPlayniteSyncService,
			commands: {
				getSyncGamesCommandHandler: playniteIntegration.commands.getSyncGamesCommandHandler,
			},
		},
		gameSession: {
			commands: {
				getOpenGameSessionCommandHandler: gameSession.commands.getOpenGameSessionCommandHandler,
				getCloseGameSessionCommandHandler: gameSession.commands.getCloseGameSessionCommandHandler,
				getStaleGameSessionCommandHandler: gameSession.commands.getStaleGameSessionCommandHandler,
			},
		},
		getLogService: () => backendLogService,
		getEventBus: () => eventBus,
	};

	return Object.freeze(api);
};
