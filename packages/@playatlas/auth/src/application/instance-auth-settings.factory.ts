import type { IEntityFactoryPort } from "@playatlas/common/application";
import type { IClockPort } from "@playatlas/common/infra";
import {
	makeInstanceAuthSettings,
	rehydrateInstanceAuthSettings,
	type InstanceAuthSettings,
} from "../domain/instance-auth-settings.entity";
import type {
	MakeInstanceAuthSettingsProps,
	RehydrateInstanceAuthSettingsProps,
} from "../domain/instance-auth-settings.entity.types";

export type IInstanceAuthSettingsFactoryPort = IEntityFactoryPort<
	MakeInstanceAuthSettingsProps,
	RehydrateInstanceAuthSettingsProps,
	InstanceAuthSettings
>;

export type InstanceAuthSettingsFactoryDeps = {
	clock: IClockPort;
};

export const makeInstanceAuthSettingsFactory = (
	deps: InstanceAuthSettingsFactoryDeps,
): IInstanceAuthSettingsFactoryPort => {
	return {
		create: (props) => makeInstanceAuthSettings(props, deps),
		rehydrate: (props) => rehydrateInstanceAuthSettings(props, deps),
	};
};
