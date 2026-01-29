import type { PlatformId, PlaynitePlatformId } from "@playatlas/common/domain";
import type { IClockPort } from "@playatlas/common/infra";
import type { PlatformName } from "./platform.entity";

export type PlaynitePlatformSnapshot = {
	id: PlaynitePlatformId | null;
	specificationId: string | null;
};

type SyncProps = {
	lastUpdatedAt: Date;
	createdAt: Date;
};

type SoftDeleteProps = {
	deletedAt: Date | null;
	deleteAfter: Date | null;
};

type PlayniteProps = {
	playniteSnapshot: PlaynitePlatformSnapshot | null;
};

type BaseProps = {
	id: PlatformId;
	name: string;
};

export type MakePlatformProps = Partial<SyncProps> &
	BaseProps &
	Partial<SoftDeleteProps> &
	Partial<PlayniteProps>;

export type RehydratePlatformProps = SyncProps & BaseProps & SoftDeleteProps & PlayniteProps;

export type MakePlatformDeps = {
	clock: IClockPort;
};

export type UpdatePlatformFromPlayniteProps = {
	playniteSnapshot: PlaynitePlatformSnapshot;
	name: PlatformName;
};
