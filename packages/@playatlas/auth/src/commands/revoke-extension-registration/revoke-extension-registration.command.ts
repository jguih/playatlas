import type { ExtensionRegistrationId } from "@playatlas/common/domain";

export type RevokeExtensionRegistrationCommand = {
	registrationId: ExtensionRegistrationId;
};
