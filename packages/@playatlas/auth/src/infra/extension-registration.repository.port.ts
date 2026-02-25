import type { ExtensionRegistrationId } from "@playatlas/common/domain";
import type { IEntityRepositoryPort } from "@playatlas/common/infra";
import type {
	ExtensionRegistration,
	ExtensionRegistrationExtensionId,
} from "../domain/extension-registration.entity";

export type IExtensionRegistrationRepositoryPort = IEntityRepositoryPort<
	ExtensionRegistrationId,
	ExtensionRegistration
> & {
	getByExtensionId: (extensionId: ExtensionRegistrationExtensionId) => ExtensionRegistration | null;
};
