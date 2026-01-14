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
import type {
	IExtensionRegistrationRepositoryPort,
	InstanceAuthSettingsRepository,
	InstanceSessionRepository,
} from "@playatlas/auth/infra";
import type { IGetAllExtensionRegistrationsQueryHandlerPort } from "@playatlas/auth/queries";

export type IAuthModulePort = {
	getExtensionRegistrationRepository: () => IExtensionRegistrationRepositoryPort;
	getInstanceAuthSettingsRepository: () => InstanceAuthSettingsRepository;
	getInstanceSessionRepository: () => InstanceSessionRepository;
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
