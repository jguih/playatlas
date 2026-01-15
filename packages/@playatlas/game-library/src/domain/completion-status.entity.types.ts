import type { CompletionStatusId } from "@playatlas/common/domain";

export type MakeCompletionStatusProps = {
	id: CompletionStatusId;
	name: string;
	lastUpdatedAt: Date;
};
