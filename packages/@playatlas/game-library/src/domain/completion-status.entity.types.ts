import type { CompletionStatusId } from "@playatlas/common/domain";
import type { IClockPort } from "@playatlas/common/infra";

type CommonProps = {
	lastUpdatedAt: Date;
	createdAt: Date;
};

type BaseProps = {
	id: CompletionStatusId;
	name: string;
	deletedAt?: Date;
	deleteAfter?: Date;
};

export type MakeCompletionStatusProps = Partial<CommonProps> & BaseProps;

export type RehydrateCompletionStatusProps = CommonProps & BaseProps;

export type MakeCompletionStatusDeps = {
	clock: IClockPort;
};
