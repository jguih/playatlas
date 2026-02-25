import type { IEntityFactoryPort } from "@playatlas/common/application";
import { PlatformIdParser } from "@playatlas/common/domain";
import type { IClockPort } from "@playatlas/common/infra";
import { monotonicFactory } from "ulid";
import { makePlatform, rehydratePlatform, type Platform } from "../domain/platform.entity";
import {
	type MakePlatformProps,
	type RehydratePlatformProps,
} from "../domain/platform.entity.types";

type MakePlatformPropsWithOptionalId = Omit<MakePlatformProps, "id"> & {
	id?: MakePlatformProps["id"];
};

export type IPlatformFactoryPort = IEntityFactoryPort<
	MakePlatformPropsWithOptionalId,
	RehydratePlatformProps,
	Platform
>;

export type PlatformFactoryDeps = {
	clock: IClockPort;
};

export const makePlatformFactory = (deps: PlatformFactoryDeps): IPlatformFactoryPort => {
	const ulid = monotonicFactory();

	return {
		create: (props) =>
			makePlatform({ ...props, id: props.id ?? PlatformIdParser.fromTrusted(ulid()) }, deps),
		rehydrate: (props) => rehydratePlatform(props, deps),
	};
};
