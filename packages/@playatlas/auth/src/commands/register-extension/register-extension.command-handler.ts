import { makeExtensionRegistration } from "../../domain/extension-registration.entity";
import { IRegisterExtensionCommandHandlerPort } from "./register-extension.command-handler.port";
import { RegisterExtensionCommandHandlerDeps } from "./register-extension.command-handler.types";

export const makeRegisterExtensionHandler = ({
  extensionRegistrationRepository: repository,
  logService,
}: RegisterExtensionCommandHandlerDeps): IRegisterExtensionCommandHandlerPort => {
  return {
    execute: (command) => {
      const existing = repository.getByExtensionId(command.extensionId);

      if (existing) {
        const extensionDescription = `(Id: ${existing.getSafeId()}, ExtensionId: ${existing.getExtensionId()})`;

        if (existing.isRejected()) {
          logService.warning(
            `Attempted to register rejected extension ${extensionDescription}`
          );
          return {
            success: false,
            reason: "Extension is rejected",
            reason_code: "extension_already_registered_and_is_rejected",
          };
        }

        return {
          success: true,
          reason: "Extension is already registered",
          reason_code: "extension_already_registered",
          registrationId: existing.getId(),
        };
      }

      const registration = makeExtensionRegistration({
        extensionId: command.extensionId,
        extensionVersion: command.extensionVersion ?? null,
        hostname: command.hostname ?? null,
        os: command.os ?? null,
        publicKey: command.publicKey,
      });
      repository.add(registration);

      return {
        success: true,
        reason: "Extension registered successfully",
        reason_code: "extension_registered",
        registrationId: registration.getId(),
      };
    },
  };
};
