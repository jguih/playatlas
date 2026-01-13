import {
  makeCryptographyService,
  makeExtensionAuthService,
  makeInstanceAuthService,
} from "@playatlas/auth/application";
import {
  makeApproveExtensionRegistrationHandler,
  makeRegisterExtensionHandler,
  makeRejectExtensionRegistrationHandler,
  makeRemoveExtensionRegistrationHandler,
  makeRevokeExtensionRegistrationHandler,
} from "@playatlas/auth/commands";
import {
  makeExtensionRegistrationRepository,
  makeInstanceAuthSettingsRepository,
  makeInstanceSessionRepository,
} from "@playatlas/auth/infra";
import { makeGetAllExtensionRegistrationsQueryHandler } from "@playatlas/auth/queries";
import type {
  IDomainEventBusPort,
  ISignatureServicePort,
  LogServiceFactory,
} from "@playatlas/common/application";
import type { BaseRepositoryDeps } from "@playatlas/common/infra";
import type { IAuthModulePort } from "./auth.module.port";

export type AuthModuleDeps = {
  getDb: BaseRepositoryDeps["getDb"];
  logServiceFactory: LogServiceFactory;
  signatureService: ISignatureServicePort;
  eventBus: IDomainEventBusPort;
};

export const makeAuthModule = ({
  getDb,
  logServiceFactory,
  signatureService,
  eventBus,
}: AuthModuleDeps): IAuthModulePort => {
  const _extension_registration_repo = makeExtensionRegistrationRepository({
    getDb,
    logService: logServiceFactory.build("ExtensionRegistrationRepository"),
  });
  const _instance_auth_settings_repo = makeInstanceAuthSettingsRepository({
    getDb,
    logService: logServiceFactory.build("InstanceAuthSettingsRepository"),
  });
  const _instance_session_repo = makeInstanceSessionRepository({
    getDb,
    logService: logServiceFactory.build("InstanceSessionRepository"),
  });
  const _extension_auth_service = makeExtensionAuthService({
    logService: logServiceFactory.build("ExtensionAuthService"),
    extensionRegistrationRepository: _extension_registration_repo,
    signatureService,
  });
  const _cryptography_service = makeCryptographyService();
  const _instance_auth_service = makeInstanceAuthService({
    cryptographyService: _cryptography_service,
    instanceAuthSettingsRepository: _instance_auth_settings_repo,
    instanceSessionRepository: _instance_session_repo,
    logService: logServiceFactory.build("InstanceAuthService"),
  });
  const _approve_extension_registration_command_handler =
    makeApproveExtensionRegistrationHandler({
      logService: logServiceFactory.build(
        "ApproveExtensionRegistrationCommandHandler"
      ),
      extensionRegistrationRepository: _extension_registration_repo,
      eventBus,
    });
  const _reject_extension_registration_command_handler =
    makeRejectExtensionRegistrationHandler({
      logService: logServiceFactory.build(
        "RejectExtensionRegistrationCommandHandler"
      ),
      extensionRegistrationRepository: _extension_registration_repo,
      eventBus,
    });
  const _revoke_extension_registration_command_handler =
    makeRevokeExtensionRegistrationHandler({
      logService: logServiceFactory.build(
        "RevokeExtensionRegistrationCommandHandler"
      ),
      extensionRegistrationRepository: _extension_registration_repo,
      eventBus,
    });
  const _remove_extension_registration_command_handler =
    makeRemoveExtensionRegistrationHandler({
      logService: logServiceFactory.build(
        "RemoveExtensionRegistrationCommandHandler"
      ),
      extensionRegistrationRepository: _extension_registration_repo,
    });
  const _register_extension_command_handler = makeRegisterExtensionHandler({
    extensionRegistrationRepository: _extension_registration_repo,
    logService: logServiceFactory.build("RegisterExtensionCommandHandler"),
  });
  const _get_all_extension_registrations_query_handler =
    makeGetAllExtensionRegistrationsQueryHandler({
      extensionRegistrationRepository: _extension_registration_repo,
    });

  const authApi: IAuthModulePort = {
    getExtensionRegistrationRepository: () => _extension_registration_repo,
    getInstanceAuthSettingsRepository: () => _instance_auth_settings_repo,
    getInstanceSessionRepository: () => _instance_session_repo,
    getExtensionAuthService: () => _extension_auth_service,
    getCryptographyService: () => _cryptography_service,
    getInstanceAuthService: () => _instance_auth_service,
    commands: {
      getApproveExtensionRegistrationCommandHandler: () =>
        _approve_extension_registration_command_handler,
      getRejectExtensionRegistrationCommandHandler: () =>
        _reject_extension_registration_command_handler,
      getRevokeExtensionRegistrationCommandHandler: () =>
        _revoke_extension_registration_command_handler,
      getRemoveExtensionRegistrationCommandHandler: () =>
        _remove_extension_registration_command_handler,
      getRegisterExtensionCommandHandler: () =>
        _register_extension_command_handler,
    },
    queries: {
      getGetAllExtensionRegistrationsQueryHandler: () =>
        _get_all_extension_registrations_query_handler,
    },
  };
  return Object.freeze(authApi);
};
