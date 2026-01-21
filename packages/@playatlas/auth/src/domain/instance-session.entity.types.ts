import type { IClockPort } from "@playatlas/common/infra";
import type { InstanceSessionId } from "./value-object/instance-session-id";

type CommonProps = {
	createdAt: Date;
	lastUsedAt: Date;
	lastUpdatedAt: Date;
};

type BaseProps = {
	sessionId: InstanceSessionId;
};

export type BuildInstanceSessionProps = BaseProps & Partial<CommonProps>;

export type MakeInstanceSessionProps = BaseProps;

export type RehydrateInstanceSessionProps = BaseProps & CommonProps;

export type MakeInstanceSessionDeps = {
	clock: IClockPort;
};
