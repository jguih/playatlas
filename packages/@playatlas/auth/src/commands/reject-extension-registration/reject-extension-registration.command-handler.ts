import type { IRejectExtensionRegistrationCommandHandlerPort } from "./reject-extension-registration.command-handler.port";
import type { RejectExtensionRegistrationCommandHandlerDeps } from "./reject-extension-registration.types";

export const makeRejectExtensionRegistrationHandler = ({
  logService,
  extensionRegistrationRepository,
  eventBus,
}: RejectExtensionRegistrationCommandHandlerDeps): IRejectExtensionRegistrationCommandHandlerPort => {
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
          success: true,
          reason_code: "extension_registration_already_rejected",
          reason: "Extension is already rejected",
        };
      if (existing.isTrusted())
        return {
          success: false,
          reason_code: "cannot_reject_approved_registration",
          reason: "Cannot reject an approved extension registration",
        };
      if (!existing.isPending())
        return {
          success: false,
          reason_code: "cannot_reject_non_pending_registration",
          reason: "Extension registration is not pending",
        };
      existing.reject();
      extensionRegistrationRepository.update(existing);

      logService.info(
        `Rejected extension registration (Id: ${existing.getId()}, ExtensionId: ${existing.getExtensionId()})`
      );

      eventBus.emit({
        id: crypto.randomUUID(),
        name: "extension-registration-rejected",
        occurredAt: new Date(),
        payload: { registrationId: existing.getId() },
      });

      return {
        success: true,
        reason_code: "extension_registration_rejected",
        reason: "Extension rejected",
      };
    },
  };
};
