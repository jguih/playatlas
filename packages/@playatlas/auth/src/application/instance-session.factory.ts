import type { IEntityFactoryPort } from "@playatlas/common/application";
import type { IClockPort } from "@playatlas/common/infra";
import {
	makeInstanceSession,
	rehydrateInstanceSession,
	type InstanceSession,
} from "../domain/instance-session.entity";
import type {
	MakeInstanceSessionProps,
	RehydrateInstanceSessionProps,
} from "../domain/instance-session.entity.types";

export type IInstanceSessionFactoryPort = IEntityFactoryPort<
	MakeInstanceSessionProps,
	RehydrateInstanceSessionProps,
	InstanceSession
>;

export type InstanceSessionDeps = {
	clock: IClockPort;
};

export const makeInstanceSessionFactory = (
	deps: InstanceSessionDeps,
): IInstanceSessionFactoryPort => {
	return {
		create: (props) => makeInstanceSession(props, deps),
		rehydrate: (props) => rehydrateInstanceSession(props, deps),
	};
};
