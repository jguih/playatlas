import type { ICommandHandlerPort } from "@playatlas/common/application";
import type { ApproveExtensionRegistrationCommand } from "./approve-extension-registration.command";
import type { ApproveExtensionRegistrationCommandResult } from "./approve-extension-registration.types";

export type IApproveExtensionRegistrationCommandHandlerPort = ICommandHandlerPort<
	ApproveExtensionRegistrationCommand,
	ApproveExtensionRegistrationCommandResult
>;
