import type { ICommandHandlerPort } from "@playatlas/common/application";
import type { RevokeExtensionRegistrationCommand } from "./revoke-extension-registration.command";
import type { RevokeExtensionRegistrationCommandResult } from "./revoke-extension-registration.types";

export type IRevokeExtensionRegistrationCommandHandlerPort = ICommandHandlerPort<
	RevokeExtensionRegistrationCommand,
	RevokeExtensionRegistrationCommandResult
>;
