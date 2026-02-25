import type { IEntityFactoryPort } from "@playatlas/common/application";
import type { IClockPort } from "@playatlas/common/infra";
import {
	makeExtensionRegistration,
	rehydrateExtensionRegistration,
	type ExtensionRegistration,
} from "../domain/extension-registration.entity";
import type {
	MakeExtensionRegistrationProps,
	RehydrateExtensionRegistrationProps,
} from "../domain/extension-registration.entity.types";

export type IExtensionRegistrationFactoryPort = IEntityFactoryPort<
	MakeExtensionRegistrationProps,
	RehydrateExtensionRegistrationProps,
	ExtensionRegistration
>;

export type ExtensionRegistrationFactoryDeps = {
	clock: IClockPort;
};

export const makeExtensionRegistrationFactory = (
	deps: ExtensionRegistrationFactoryDeps,
): IExtensionRegistrationFactoryPort => {
	return {
		create: (props) => makeExtensionRegistration(props, deps),
		rehydrate: (props) => rehydrateExtensionRegistration(props, deps),
	};
};
