import type { PlatformId } from "@playatlas/common/domain";

export type MakePlatformProps = {
	id: PlatformId;
	name: string;
	specificationId: string;
	lastUpdatedAt: Date;
	icon?: string | null;
	cover?: string | null;
	background?: string | null;
	createdAt?: Date | null;
};
