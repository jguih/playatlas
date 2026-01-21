import type {
	ICryptographyServicePort,
	IExtensionAuthServicePort,
	IInstanceAuthServicePort,
	IInstanceSessionFactoryPort,
	IInstanceSessionMapperPort,
} from "@playatlas/auth/application";
import type {
	IApproveExtensionRegistrationCommandHandlerPort,
	IRegisterExtensionCommandHandlerPort,
	IRejectExtensionRegistrationCommandHandlerPort,
	IRemoveExtensionRegistrationCommandHandlerPort,
	IRevokeExtensionRegistrationCommandHandlerPort,
} from "@playatlas/auth/commands";
import type {
	IExtensionRegistrationRepositoryPort,
	IInstanceAuthSettingsRepositoryPort,
	IInstanceSessionRepositoryPort,
} from "@playatlas/auth/infra";
import type { IGetAllExtensionRegistrationsQueryHandlerPort } from "@playatlas/auth/queries";

export type IAuthModulePort = {
	getInstanceSessionMapper: () => IInstanceSessionMapperPort;
	getInstanceSessionFactory: () => IInstanceSessionFactoryPort;
	getInstanceSessionRepository: () => IInstanceSessionRepositoryPort;
	getInstanceAuthSettingsRepository: () => IInstanceAuthSettingsRepositoryPort;

	getExtensionRegistrationRepository: () => IExtensionRegistrationRepositoryPort;
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
