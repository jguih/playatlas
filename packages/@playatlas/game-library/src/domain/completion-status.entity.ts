import { validation } from "@playatlas/common/application";
import {
	InvalidStateError,
	type BaseEntity,
	type CompletionStatusId,
} from "@playatlas/common/domain";
import type { MakeCompletionStatusProps } from "./completion-status.entity.types";

type CompletionStatusName = string;

export type CompletionStatus = BaseEntity<CompletionStatusId> &
	Readonly<{
		getName: () => CompletionStatusName;
	}>;

export const makeCompletionStatus = (props: MakeCompletionStatusProps): CompletionStatus => {
	const _id: CompletionStatusId = props.id;
	const _name: CompletionStatusName = props.name;
	const _last_updated_at = props.lastUpdatedAt;

	const _validate = () => {
		if (validation.isNullOrEmptyString(_name))
			throw new InvalidStateError("Completion status name must not be empty");
	};

	_validate();

	const completionStatus: CompletionStatus = {
		getId: () => _id,
		getSafeId: () => _id,
		getName: () => _name,
		getLastUpdatedAt: () => _last_updated_at,
		validate: _validate,
	};
	return Object.freeze(completionStatus);
};
