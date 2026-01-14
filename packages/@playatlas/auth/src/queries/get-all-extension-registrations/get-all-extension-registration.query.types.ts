import type { ExtensionRegistrationResponseDto } from "../../dtos/extension-registration.response";
import type { IExtensionRegistrationRepositoryPort } from "../../infra/extension-registration.repository.port";

export type GetAllExtensionRegistrationsQueryHandlerDeps = {
	extensionRegistrationRepository: IExtensionRegistrationRepositoryPort;
};

export type GetAllExtensionRegistrationsResult =
	| { type: "not_modified" }
	| { type: "ok"; data: ExtensionRegistrationResponseDto[]; etag: string };
