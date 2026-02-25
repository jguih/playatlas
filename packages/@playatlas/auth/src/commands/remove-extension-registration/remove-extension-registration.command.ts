import {
	ExtensionRegistrationIdParser,
	type ExtensionRegistrationId,
} from "@playatlas/common/domain";
import type { RemoveExtensionRegistrationRequestDto } from "./remove-extension-registration.request.dto";

export type RemoveExtensionRegistrationCommand = {
	registrationId: ExtensionRegistrationId;
};

export const makeRemoveExtensionRegistrationCommand = (
	dto: RemoveExtensionRegistrationRequestDto,
): RemoveExtensionRegistrationCommand => {
	return {
		registrationId: ExtensionRegistrationIdParser.fromExternal(dto.registrationId),
	};
};
