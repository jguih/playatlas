import type { IClockPort } from "@playatlas/common/infra";

type CommonProps = {
	createdAt: Date;
	lastUpdatedAt: Date;
};

type BaseProps = {
	passwordHash: string;
	salt: string;
};

export type BuildInstanceAuthSettingsProps = BaseProps & Partial<CommonProps>;
export type MakeInstanceAuthSettingsProps = BaseProps;
export type RehydrateInstanceAuthSettingsProps = BaseProps & CommonProps;

export type MakeInstanceAuthSettingsDeps = {
	clock: IClockPort;
};
