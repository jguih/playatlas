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
      reason_code: "not_found" | "invalid_operation";
    }
  | {
      success: true;
      reason: string;
      reason_code: "registration_approved" | "registration_already_approved";
    };
