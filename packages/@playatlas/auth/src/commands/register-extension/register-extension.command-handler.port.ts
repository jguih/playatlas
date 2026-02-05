import type { ICommandHandlerPort } from "@playatlas/common/application";
import type { RegisterExtensionCommand } from "./register-extension.command";
import type { RegisterExtensionCommandResult } from "./register-extension.command-handler.types";

export type IRegisterExtensionCommandHandlerPort = ICommandHandlerPort<
	RegisterExtensionCommand,
	RegisterExtensionCommandResult
>;
