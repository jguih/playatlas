import type {
	ICryptographyServicePort,
	IExtensionAuthServicePort,
	IInstanceAuthServicePort,
} from "@playatlas/auth/application";
import type {
	IApproveExtensionRegistrationCommandHandlerPort,
	IRegisterExtensionCommandHandlerPort,
	IRejectExtensionRegistrationCommandHandlerPort,
	IRemoveExtensionRegistrationCommandHandlerPort,
	IRevokeExtensionRegistrationCommandHandlerPort,
} from "@playatlas/auth/commands";
import type { IGetAllExtensionRegistrationsQueryHandlerPort } from "@playatlas/auth/queries";
import type { IDomainEventBusPort, ILogServicePort } from "@playatlas/common/application";
import type { ISystemConfigPort } from "@playatlas/common/infra";
import type {
	IClassificationTierCalibrationServicePort,
	IScoreEngineCorpusMinerPort,
} from "@playatlas/game-library/application";
import type {
	IGameAssetsContextFactoryPort,
	IGameAssetsReindexerPort,
} from "@playatlas/game-library/infra";
import type {
	IGetAllClassificationsQueryHandler,
	IGetAllCompaniesQueryHandlerPort,
	IGetAllCompletionStatusesQueryHandlerPort,
	IGetAllGameClassificationsQueryHandlerPort,
	IGetAllGamesQueryHandlerPort,
	IGetAllGenresQueryHandlerPort,
	IGetAllPlatformsQueryHandlerPort,
	IGetAllTagsQueryHandlerPort,
} from "@playatlas/game-library/queries";
import type {
	ICloseGameSessionCommandHandlerPort,
	IOpenGameSessionCommandHandlerPort,
	IStaleGameSessionCommandHandlerPort,
} from "@playatlas/game-session/commands";
import type { IGetAllGameSessionsQueryHandlerPort } from "@playatlas/game-session/queries";
import type {
	ILibraryManifestServicePort,
	IPlayniteSyncServicePort,
} from "@playatlas/playnite-integration/application";
import type { ISyncGamesCommandHandlerPort } from "@playatlas/playnite-integration/commands";
import type { IPlayniteMediaFilesHandlerPort } from "@playatlas/playnite-integration/infra";

export type PlayAtlasApiV1 = {
	system: {
		getSystemConfig: () => ISystemConfigPort;
	};
	gameLibrary: {
		queries: {
			getGetAllGamesQueryHandler: () => IGetAllGamesQueryHandlerPort;
			getGetAllCompaniesQueryHandler: () => IGetAllCompaniesQueryHandlerPort;
			getGetAllPlatformsQueryHandler: () => IGetAllPlatformsQueryHandlerPort;
			getGetAllGenresQueryHandler: () => IGetAllGenresQueryHandlerPort;
			getGetAllCompletionStatusesQueryHandler: () => IGetAllCompletionStatusesQueryHandlerPort;
			getGetAllTagsQueryHandler: () => IGetAllTagsQueryHandlerPort;
		};
		getGameAssetsContextFactory: () => IGameAssetsContextFactoryPort;
		getGameAssetsReindexer: () => IGameAssetsReindexerPort;
		scoreEngine: {
			queries: {
				getGetAllClassificationsQueryHandler: () => IGetAllClassificationsQueryHandler;
				getGetAllGameClassificationsQueryHandler: () => IGetAllGameClassificationsQueryHandlerPort;
			};
			getClassificationTierCalibrationService: () => IClassificationTierCalibrationServicePort;
			getScoreEngineCorpusMiner: () => IScoreEngineCorpusMinerPort;
		};
	};
	auth: {
		getExtensionAuthService: () => IExtensionAuthServicePort;
		getCryptographyService: () => ICryptographyServicePort;
		getInstanceAuthService: () => IInstanceAuthServicePort;
		commands: {
			getApproveExtensionRegistrationCommandHandler: () => IApproveExtensionRegistrationCommandHandlerPort;
			getRejectExtensionRegistrationCommandHandler: () => IRejectExtensionRegistrationCommandHandlerPort;
			getRevokeExtensionRegistrationCommandHandler: () => IRevokeExtensionRegistrationCommandHandlerPort;
			getRemoveExtensionRegistrationCommandHandler: () => IRemoveExtensionRegistrationCommandHandlerPort;
			getRegisterExtensionCommandHandler: () => IRegisterExtensionCommandHandlerPort;
		};
		queries: {
			getGetAllExtensionRegistrationsQueryHandler: () => IGetAllExtensionRegistrationsQueryHandlerPort;
		};
	};
	playniteIntegration: {
		getPlayniteMediaFilesHandler: () => IPlayniteMediaFilesHandlerPort;
		getLibraryManifestService: () => ILibraryManifestServicePort;
		getPlayniteSyncService: () => IPlayniteSyncServicePort;
		commands: {
			getSyncGamesCommandHandler: () => ISyncGamesCommandHandlerPort;
		};
	};
	gameSession: {
		commands: {
			getOpenGameSessionCommandHandler: () => IOpenGameSessionCommandHandlerPort;
			getCloseGameSessionCommandHandler: () => ICloseGameSessionCommandHandlerPort;
			getStaleGameSessionCommandHandler: () => IStaleGameSessionCommandHandlerPort;
		};
		queries: {
			getGetAllGameSessionsQueryHandler: () => IGetAllGameSessionsQueryHandlerPort;
		};
	};
	getLogService: () => ILogServicePort;
	getEventBus: () => IDomainEventBusPort;
};
