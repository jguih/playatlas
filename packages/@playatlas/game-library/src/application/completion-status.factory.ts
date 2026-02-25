import type { IEntityFactoryPort } from "@playatlas/common/application";
import { CompletionStatusIdParser } from "@playatlas/common/domain";
import type { IClockPort } from "@playatlas/common/infra";
import { monotonicFactory } from "ulid";
import {
	makeCompletionStatus,
	rehydrateCompletionStatus,
	type CompletionStatus,
} from "../domain/completion-status.entity";
import type {
	MakeCompletionStatusProps,
	RehydrateCompletionStatusProps,
} from "../domain/completion-status.entity.types";

type MakeCompletionStatusPropsWithOptionalId = Omit<MakeCompletionStatusProps, "id"> & {
	id?: MakeCompletionStatusProps["id"];
};

export type ICompletionStatusFactoryPort = IEntityFactoryPort<
	MakeCompletionStatusPropsWithOptionalId,
	RehydrateCompletionStatusProps,
	CompletionStatus
>;

export type CompletionStatusFactoryDeps = {
	clock: IClockPort;
};

export const makeCompletionStatusFactory = (
	deps: CompletionStatusFactoryDeps,
): ICompletionStatusFactoryPort => {
	const ulid = monotonicFactory();

	return {
		create: (props) =>
			makeCompletionStatus(
				{ ...props, id: props.id ?? CompletionStatusIdParser.fromTrusted(ulid()) },
				deps,
			),
		rehydrate: (props) => rehydrateCompletionStatus(props, deps),
	};
};
