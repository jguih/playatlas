import { IApproveExtensionRegistrationCommandHandlerPort } from "./approve-extension-registration.command-handler.port";
import { ApproveExtensionRegistrationServiceDeps } from "./approve-extension-registration.types";

export const makeApproveExtensionRegistrationHandler = ({
  logService,
  extensionRegistrationRepository,
  eventBus,
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
      if (existing.isTrusted())
        return {
          success: true,
          reason_code: "extension_registration_already_approved",
          reason: "Registration is already approved",
        };
      if (existing.isRejected())
        return {
          success: false,
          reason_code: "cannot_approve_rejected_registration",
          reason: "Cannot approve a rejected extension registration",
        };
      if (!existing.isPending())
        return {
          success: false,
          reason_code: "cannot_approve_non_pending_registration",
          reason: "Extension registration is not pending",
        };

      existing.approve();
      extensionRegistrationRepository.update(existing);

      logService.info(
        `Approved extension registration (Id: ${existing.getId()}, ExtensionId: ${existing.getExtensionId()})`
      );

      eventBus.emit({
        name: "extension-registration-approved",
        id: crypto.randomUUID(),
        occurredAt: new Date(),
        payload: { registrationId: existing.getId() },
      });

      return {
        success: true,
        reason_code: "extension_registration_approved",
        reason: "Approved",
      };
    },
  };
};
