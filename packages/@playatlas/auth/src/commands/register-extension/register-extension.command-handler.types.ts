import { ILogServicePort } from "@playatlas/common/application";
import { IExtensionRegistrationRepositoryPort } from "../../infra/extension-registration.repository.port";

export type RegisterExtensionCommandResult =
  | {
      success: false;
      reason: string;
      reason_code: "not_found" | "invalid_operation";
    }
  | {
      success: true;
      reason: string;
      reason_code: "ok";
    };

export type RegisterExtensionCommandHandlerDeps = {
  extensionRegistrationRepository: IExtensionRegistrationRepositoryPort;
  logService: ILogServicePort;
};
