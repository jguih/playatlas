import type { RegisterExtensionRequestDto } from "./register-extension.request.dto";

export type RegisterExtensionCommand = {
	extensionId: string;
	publicKey: string;
	hostname?: string | null;
	os?: string | null;
	extensionVersion?: string | null;
};

export const makeRegisterExtensionCommand = (
	requestDto: RegisterExtensionRequestDto,
): RegisterExtensionCommand => {
	return {
		extensionId: requestDto.ExtensionId,
		publicKey: requestDto.PublicKey,
		hostname: requestDto.Hostname,
		os: requestDto.Os,
		extensionVersion: requestDto.ExtensionVersion,
	};
};
