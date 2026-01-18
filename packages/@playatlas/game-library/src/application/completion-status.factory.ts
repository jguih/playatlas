import type { IEntityFactoryPort } from "@playatlas/common/application";
import type { IClockPort } from "@playatlas/common/infra";
import {
	makeCompletionStatus,
	rehydrateCompletionStatus,
	type CompletionStatus,
} from "../domain/completion-status.entity";
import type {
	MakeCompletionStatusProps,
	RehydrateCompletionStatusProps,
} from "../domain/completion-status.entity.types";

export type ICompletionStatusFactoryPort = IEntityFactoryPort<
	MakeCompletionStatusProps,
	RehydrateCompletionStatusProps,
	CompletionStatus
>;

export type CompletionStatusFactoryDeps = {
	clock: IClockPort;
};

export const makeCompletionStatusFactory = (
	deps: CompletionStatusFactoryDeps,
): ICompletionStatusFactoryPort => {
	return {
		create: (props) => makeCompletionStatus(props, deps),
		rehydrate: (props) => rehydrateCompletionStatus(props, deps),
	};
};
