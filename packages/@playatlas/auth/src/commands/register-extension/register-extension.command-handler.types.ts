import type { IDomainEventBusPort, ILogServicePort } from "@playatlas/common/application";
import type { ExtensionRegistrationId } from "@playatlas/common/domain";
import type { IExtensionRegistrationRepositoryPort } from "../../infra/extension-registration.repository.port";

export type RegisterExtensionCommandResult =
	| {
			success: false;
			reason: string;
			reason_code: "not_found" | "extension_already_registered_and_is_rejected";
	  }
	| {
			success: true;
			reason: string;
			reason_code: "extension_registered" | "extension_already_registered";
			registrationId: ExtensionRegistrationId;
	  };

export type RegisterExtensionCommandHandlerDeps = {
	extensionRegistrationRepository: IExtensionRegistrationRepositoryPort;
	logService: ILogServicePort;
	eventBus: IDomainEventBusPort;
};
