import type { ICommandHandlerPort } from "@playatlas/common/application";
import type { RejectExtensionRegistrationCommand } from "./reject-extension-registration.command";
import type { RejectExtensionRegistrationCommandResult } from "./reject-extension-registration.types";

export type IRejectExtensionRegistrationCommandHandlerPort = ICommandHandlerPort<
	RejectExtensionRegistrationCommand,
	RejectExtensionRegistrationCommandResult
>;
