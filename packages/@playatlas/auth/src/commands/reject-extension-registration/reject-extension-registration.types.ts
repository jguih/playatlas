import type { IDomainEventBusPort, ILogServicePort } from "@playatlas/common/application";
import type { IExtensionRegistrationRepositoryPort } from "../../infra";

export type RejectExtensionRegistrationCommandHandlerDeps = {
	extensionRegistrationRepository: IExtensionRegistrationRepositoryPort;
	logService: ILogServicePort;
	eventBus: IDomainEventBusPort;
};

export type RejectExtensionRegistrationCommandResult =
	| {
			success: false;
			reason: string;
			reason_code:
				| "not_found"
				| "cannot_reject_approved_registration"
				| "cannot_reject_non_pending_registration";
	  }
	| {
			success: true;
			reason: string;
			reason_code: "extension_registration_rejected" | "extension_registration_already_rejected";
	  };
