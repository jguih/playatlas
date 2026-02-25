import type { PlayniteTagId, TagId } from "@playatlas/common/domain";
import type { IClockPort } from "@playatlas/common/infra";
import type { TagName } from "./tag.entity";

export type PlayniteTagSnapshot = {
	id: PlayniteTagId | null;
};

type SyncProps = {
	lastUpdatedAt: Date;
	createdAt: Date;
};

type SoftDeleteProps = {
	deletedAt: Date | null;
	deleteAfter: Date | null;
};

type BaseProps = {
	id: TagId;
	name: TagName;
};

type PlayniteProps = {
	playniteSnapshot: PlayniteTagSnapshot | null;
};

export type MakeTagProps = Partial<SyncProps> &
	BaseProps &
	Partial<SoftDeleteProps> &
	Partial<PlayniteProps>;

export type RehydrateTagProps = SyncProps & BaseProps & SoftDeleteProps & PlayniteProps;

export type MakeTagDeps = {
	clock: IClockPort;
};

export type UpdateTagFromPlayniteProps = {
	playniteSnapshot: PlayniteTagSnapshot;
	name: TagName;
};
