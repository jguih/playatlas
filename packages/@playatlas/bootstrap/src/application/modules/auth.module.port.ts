import type {
  ICryptographyServicePort,
  IExtensionAuthServicePort,
  IInstanceAuthServicePort,
} from "@playatlas/auth/application";
import type {
  IApproveExtensionRegistrationCommandHandlerPort,
  IRejectExtensionRegistrationCommandHandlerPort,
  IRemoveExtensionRegistrationCommandHandlerPort,
  IRevokeExtensionRegistrationCommandHandlerPort,
} from "@playatlas/auth/commands";
import type {
  ExtensionRegistrationRepository,
  InstanceAuthSettingsRepository,
  InstanceSessionRepository,
} from "@playatlas/auth/infra";
import type { IGetAllExtensionRegistrationsQueryHandlerPort } from "@playatlas/auth/queries";

export type IAuthModulePort = {
  getExtensionRegistrationRepository: () => ExtensionRegistrationRepository;
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
  };
  queries: {
    getGetAllExtensionRegistrationsQueryHandler: () => IGetAllExtensionRegistrationsQueryHandlerPort;
  };
};
