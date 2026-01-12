import { ILogServicePort } from "@playatlas/common/application";
import { CommandHandler } from "@playatlas/common/common";
import { ExtensionRegistrationRepository } from "../../infra/extension-registration.repository.port";
import { ApproveExtensionRegistrationCommand } from "./approve-extension-registration.command";

export type ApproveExtensionRegistrationServiceDeps = {
  extensionRegistrationRepository: ExtensionRegistrationRepository;
  logService: ILogServicePort;
};

export type ApproveExtensionRegistrationServiceResult =
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

export type IApproveExtensionRegistrationCommandHandlerPort = CommandHandler<
  ApproveExtensionRegistrationCommand,
  ApproveExtensionRegistrationServiceResult
>;

export const makeApproveExtensionRegistrationHandler = ({
  logService,
  extensionRegistrationRepository,
}: ApproveExtensionRegistrationServiceDeps): IApproveExtensionRegistrationCommandHandlerPort => {
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
          reason: "Cannot approve a rejected extension registration",
        };
      if (existing.isTrusted())
        return {
          success: false,
          reason_code: "invalid_operation",
          reason: "Cannot approve an already approved extension registration",
        };
      if (!existing.isPending())
        return {
          success: false,
          reason_code: "invalid_operation",
          reason: "Extension registration is not pending",
        };
      existing.approve();
      extensionRegistrationRepository.update(existing);
      logService.info(
        `Approved extension registration (Id: ${existing.getId()}, ExtensionId: ${existing.getExtensionId()})`
      );
      return {
        success: true,
        reason_code: "ok",
        reason: "Approved",
      };
    },
  };
};
