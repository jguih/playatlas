import { ICommandHandlerPort } from "@playatlas/common/common";
import { RejectExtensionRegistrationCommand } from "./reject-extension-registration.command";
import { RejectExtensionRegistrationCommandResult } from "./reject-extension-registration.types";

export type IRejectExtensionRegistrationCommandHandlerPort =
  ICommandHandlerPort<
    RejectExtensionRegistrationCommand,
    RejectExtensionRegistrationCommandResult
  >;
