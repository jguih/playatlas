import type { ExtensionRegistrationId } from "@playatlas/common/domain";

export type RejectExtensionRegistrationCommand = {
	registrationId: ExtensionRegistrationId;
};
