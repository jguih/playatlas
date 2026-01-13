import {
  IDomainEventBusPort,
  ILogServicePort,
} from "@playatlas/common/application";
import { IExtensionRegistrationRepositoryPort } from "../../infra";

export type RevokeExtensionRegistrationCommandHandlerDeps = {
  extensionRegistrationRepository: IExtensionRegistrationRepositoryPort;
  logService: ILogServicePort;
  eventBus: IDomainEventBusPort;
};

export type RevokeExtensionRegistrationCommandResult =
  | {
      success: false;
      reason: string;
      reason_code:
        | "not_found"
        | "cannot_revoke_pending_registration"
        | "cannot_revoke_non_trusted_registration";
    }
  | {
      success: true;
      reason: string;
      reason_code:
        | "extension_registration_revoked"
        | "extension_registration_already_rejected";
    };
