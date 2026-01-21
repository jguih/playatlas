import type { IExtensionRegistrationMapperPort } from "../../application";
import type { ExtensionRegistrationResponseDto } from "../../dtos/extension-registration.response";
import type { IExtensionRegistrationRepositoryPort } from "../../infra/extension-registration.repository.port";

export type GetAllExtensionRegistrationsQueryHandlerDeps = {
	extensionRegistrationRepository: IExtensionRegistrationRepositoryPort;
	extensionRegistrationMapper: IExtensionRegistrationMapperPort;
};

export type GetAllExtensionRegistrationsResult =
	| { type: "not_modified" }
	| { type: "ok"; data: ExtensionRegistrationResponseDto[]; etag: string };
