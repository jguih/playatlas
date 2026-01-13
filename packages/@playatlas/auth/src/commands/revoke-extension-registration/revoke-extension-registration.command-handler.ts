import type { IRevokeExtensionRegistrationCommandHandlerPort } from "./revoke-extension-registration.command-handler.port";
import type { RevokeExtensionRegistrationCommandHandlerDeps } from "./revoke-extension-registration.types";

export const makeRevokeExtensionRegistrationHandler = ({
  logService,
  extensionRegistrationRepository,
  eventBus,
}: RevokeExtensionRegistrationCommandHandlerDeps): IRevokeExtensionRegistrationCommandHandlerPort => {
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
          reason: "Extension registration is already rejected",
        };
      if (existing.isPending())
        return {
          success: false,
          reason_code: "cannot_revoke_pending_registration",
          reason: "Cannot revoke a pending extension registration",
        };
      if (!existing.isTrusted())
        return {
          success: false,
          reason_code: "cannot_revoke_non_trusted_registration",
          reason: "Extension registration is not trusted",
        };

      existing.revoke();
      extensionRegistrationRepository.update(existing);

      logService.info(
        `Revoked extension registration (Id: ${existing.getId()}, ExtensionId: ${existing.getExtensionId()})`
      );

      eventBus.emit({
        id: crypto.randomUUID(),
        name: "extension-registration-revoked",
        occurredAt: new Date(),
        payload: { registrationId: existing.getId() },
      });

      return {
        success: true,
        reason_code: "extension_registration_revoked",
        reason: "Extension registration revoked",
      };
    },
  };
};
