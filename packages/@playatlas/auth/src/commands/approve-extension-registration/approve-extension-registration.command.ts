import {
	ExtensionRegistrationIdParser,
	type ExtensionRegistrationId,
} from "@playatlas/common/domain";
import type { ApproveExtensionRegistrationRequestDto } from "./approve-extension-registration.request.dto";

export type ApproveExtensionRegistrationCommand = {
	registrationId: ExtensionRegistrationId;
};

export const makeApproveExtensionRegistrationCommand = (
	dto: ApproveExtensionRegistrationRequestDto,
): ApproveExtensionRegistrationCommand => {
	return {
		registrationId: ExtensionRegistrationIdParser.fromExternal(dto.registrationId),
	};
};
