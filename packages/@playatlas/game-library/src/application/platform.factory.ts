import type { IEntityFactoryPort } from "@playatlas/common/application";
import type { IClockPort } from "@playatlas/common/infra";
import { makePlatform, rehydratePlatform, type Platform } from "../domain/platform.entity";
import {
	type MakePlatformProps,
	type RehydratePlatformProps,
} from "../domain/platform.entity.types";

export type IPlatformFactoryPort = IEntityFactoryPort<
	MakePlatformProps,
	RehydratePlatformProps,
	Platform
>;

export type PlatformFactoryDeps = {
	clock: IClockPort;
};

export const makePlatformFactory = (deps: PlatformFactoryDeps): IPlatformFactoryPort => {
	return {
		create: (props) => makePlatform(props, deps),
		rehydrate: (props) => rehydratePlatform(props, deps),
	};
};
