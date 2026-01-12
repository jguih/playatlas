import { IEntityRepositoryPort } from "@playatlas/common/infra";
import type {
  ExtensionRegistration,
  ExtensionRegistrationExtensionId,
  ExtensionRegistrationId,
} from "../domain/extension-registration.entity";

export type IExtensionRegistrationRepositoryPort = IEntityRepositoryPort<
  ExtensionRegistrationId,
  ExtensionRegistration
> & {
  getByExtensionId: (
    extensionId: ExtensionRegistrationExtensionId
  ) => ExtensionRegistration | null;
};
