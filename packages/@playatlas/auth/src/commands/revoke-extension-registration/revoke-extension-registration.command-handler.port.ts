import { ICommandHandlerPort } from "@playatlas/common/common";
import { RevokeExtensionRegistrationCommand } from "./revoke-extension-registration.command";
import { RevokeExtensionRegistrationCommandResult } from "./revoke-extension-registration.types";

export type IRevokeExtensionRegistrationCommandHandlerPort =
  ICommandHandlerPort<
    RevokeExtensionRegistrationCommand,
    RevokeExtensionRegistrationCommandResult
  >;
