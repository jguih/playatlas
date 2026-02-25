import type { IQueryHandlerPort } from "@playatlas/common/application";
import { createHashForObject } from "@playatlas/common/infra";
import type { GetAllExtensionRegistrationQuery } from "./get-all-extension-registration.query";
import type {
	GetAllExtensionRegistrationsQueryHandlerDeps,
	GetAllExtensionRegistrationsResult,
} from "./get-all-extension-registration.query.types";

export type IGetAllExtensionRegistrationsQueryHandlerPort = IQueryHandlerPort<
	GetAllExtensionRegistrationQuery,
	GetAllExtensionRegistrationsResult
>;

export const makeGetAllExtensionRegistrationsQueryHandler = ({
	extensionRegistrationRepository,
	extensionRegistrationMapper,
}: GetAllExtensionRegistrationsQueryHandlerDeps): IGetAllExtensionRegistrationsQueryHandlerPort => {
	return {
		execute: ({ ifNoneMatch } = {}) => {
			const registrations = extensionRegistrationRepository.all();

			if (!registrations || registrations.length === 0) {
				return { type: "ok", data: [], etag: '"empty"' };
			}

			const registrationDtos = extensionRegistrationMapper.toDtoList(registrations);
			const hash = createHashForObject(registrationDtos);
			const etag = `"${hash}"`;

			if (ifNoneMatch === etag) {
				return { type: "not_modified" };
			}

			return { type: "ok", data: registrationDtos, etag };
		},
	};
};
