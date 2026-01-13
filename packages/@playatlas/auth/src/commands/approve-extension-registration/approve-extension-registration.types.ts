import {
  IDomainEventBusPort,
  ILogServicePort,
} from "@playatlas/common/application";
import { IExtensionRegistrationRepositoryPort } from "../../infra";

export type ApproveExtensionRegistrationServiceDeps = {
  extensionRegistrationRepository: IExtensionRegistrationRepositoryPort;
  logService: ILogServicePort;
  eventBus: IDomainEventBusPort;
};

export type ApproveExtensionRegistrationCommandResult =
  | {
      success: false;
      reason: string;
      reason_code:
        | "not_found"
        | "cannot_approve_rejected_registration"
        | "cannot_approve_non_pending_registration";
    }
  | {
      success: true;
      reason: string;
      reason_code:
        | "extension_registration_approved"
        | "extension_registration_already_approved";
    };
