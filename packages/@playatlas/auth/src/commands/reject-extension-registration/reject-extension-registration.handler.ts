import { type ILogServicePort } from "@playatlas/common/application";
import { type ICommandHandlerPort } from "@playatlas/common/common";
import { type IExtensionRegistrationRepositoryPort } from "../../infra/extension-registration.repository.port";
import { type RejectExtensionRegistrationCommand } from "./reject-extension-registration.command";

export type RejectExtensionRegistrationServiceDeps = {
  extensionRegistrationRepository: IExtensionRegistrationRepositoryPort;
  logService: ILogServicePort;
};

export type RejectExtensionRegistrationServiceResult =
  | {
      success: false;
      reason: string;
      reason_code: "not_found" | "invalid_operation";
    }
  | {
      success: true;
      reason: string;
      reason_code: "ok";
    };

export type IRejectExtensionRegistrationCommandHandlerPort =
  ICommandHandlerPort<
    RejectExtensionRegistrationCommand,
    RejectExtensionRegistrationServiceResult
  >;

export const makeRejectExtensionRegistrationHandler = ({
  logService,
  extensionRegistrationRepository,
}: RejectExtensionRegistrationServiceDeps): IRejectExtensionRegistrationCommandHandlerPort => {
  return {
    execute: (command) => {
      const existing = extensionRegistrationRepository.getById(
        command.registrationId
      );
      if (!existing)
        return {
          success: false,
          reason_code: "not_found",
          reason: `Extension registration with id ${command.registrationId} not found`,
        };
      if (existing.isRejected())
        return {
          success: false,
          reason_code: "invalid_operation",
          reason: "Cannot reject an already rejected extension registration",
        };
      if (existing.isTrusted())
        return {
          success: false,
          reason_code: "invalid_operation",
          reason: "Cannot reject an approved extension registration",
        };
      if (!existing.isPending())
        return {
          success: false,
          reason_code: "invalid_operation",
          reason: "Extension registration is not pending",
        };
      existing.reject();
      extensionRegistrationRepository.update(existing);
      logService.info(
        `Rejected extension registration (Id: ${existing.getId()}, ExtensionId: ${existing.getExtensionId()})`
      );
      return {
        success: true,
        reason_code: "ok",
        reason: "Rejected",
      };
    },
  };
};
