import type { IClockPort } from "@playatlas/common/infra";
import type { SessionId } from "./value-object/session-id";

type CommonProps = {
	createdAt: Date;
	lastUsedAt: Date;
	lastUpdatedAt: Date;
};

type BaseProps = {
	sessionId: SessionId;
};

export type BuildInstanceSessionProps = BaseProps & Partial<CommonProps>;

export type MakeInstanceSessionProps = BaseProps;

export type RehydrateInstanceSessionProps = BaseProps & CommonProps;

export type MakeInstanceSessionDeps = {
	clock: IClockPort;
};
