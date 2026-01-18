import type { PlatformId } from "@playatlas/common/domain";
import type { IClockPort } from "@playatlas/common/infra";

type CommonProps = {
	lastUpdatedAt: Date;
	createdAt: Date;
};

type BaseProps = {
	id: PlatformId;
	name: string;
	specificationId: string;
	icon?: string | null;
	cover?: string | null;
	background?: string | null;
	deletedAt?: Date;
	deleteAfter?: Date;
};

export type MakePlatformProps = Partial<CommonProps> & BaseProps;

export type RehydratePlatformProps = CommonProps & BaseProps;

export type MakePlatformDeps = {
	clock: IClockPort;
};

export type UpdatePlatformFromPlayniteProps = {
	name: string;
	specificationId: string;
	icon?: string | null;
	cover?: string | null;
	background?: string | null;
};
