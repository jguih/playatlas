import type { CompletionStatusId, PlayniteCompletionStatusId } from "@playatlas/common/domain";
import type { IClockPort } from "@playatlas/common/infra";
import type { CompletionStatusName } from "./completion-status.entity";

type CommonProps = {
	lastUpdatedAt: Date;
	createdAt: Date;
};

type BaseProps = {
	id: CompletionStatusId;
	name: string;
	deletedAt?: Date | null;
	deleteAfter?: Date | null;
	playniteId?: PlayniteCompletionStatusId | null;
};

export type MakeCompletionStatusProps = Partial<CommonProps> & BaseProps;

export type RehydrateCompletionStatusProps = CommonProps & BaseProps;

export type MakeCompletionStatusDeps = {
	clock: IClockPort;
};

export type UpdateCompletionStatusFromPlayniteProps = {
	name: CompletionStatusName;
	playniteId: PlayniteCompletionStatusId;
};
