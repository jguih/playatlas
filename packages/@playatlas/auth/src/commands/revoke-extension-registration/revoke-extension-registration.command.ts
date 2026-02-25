import {
	ExtensionRegistrationIdParser,
	type ExtensionRegistrationId,
} from "@playatlas/common/domain";
import type { RevokeExtensionRegistrationRequestDto } from "./revoke-extension-registration.request.dto";

export type RevokeExtensionRegistrationCommand = {
	registrationId: ExtensionRegistrationId;
};

export const makeRevokeExtensionRegistrationCommand = (
	dto: RevokeExtensionRegistrationRequestDto,
): RevokeExtensionRegistrationCommand => {
	return {
		registrationId: ExtensionRegistrationIdParser.fromExternal(dto.registrationId),
	};
};
