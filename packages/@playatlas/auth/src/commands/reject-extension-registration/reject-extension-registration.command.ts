import {
	ExtensionRegistrationIdParser,
	type ExtensionRegistrationId,
} from "@playatlas/common/domain";
import type { RejectExtensionRegistrationRequestDto } from "./reject-extension-registration.request.dto";

export type RejectExtensionRegistrationCommand = {
	registrationId: ExtensionRegistrationId;
};

export const makeRejectExtensionRegistrationCommand = (
	dto: RejectExtensionRegistrationRequestDto,
): RejectExtensionRegistrationCommand => {
	return {
		registrationId: ExtensionRegistrationIdParser.fromExternal(dto.registrationId),
	};
};
