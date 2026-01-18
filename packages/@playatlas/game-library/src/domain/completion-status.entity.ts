import { validation } from "@playatlas/common/application";
import { makeSoftDeletable, type EntitySoftDeleteProps } from "@playatlas/common/common";
import {
	InvalidStateError,
	type BaseEntity,
	type CompletionStatusId,
} from "@playatlas/common/domain";
import type {
	MakeCompletionStatusDeps,
	MakeCompletionStatusProps,
	RehydrateCompletionStatusProps,
} from "./completion-status.entity.types";

type CompletionStatusName = string;

export type CompletionStatus = BaseEntity<CompletionStatusId> &
	EntitySoftDeleteProps &
	Readonly<{
		getName: () => CompletionStatusName;
		updateFromPlaynite: (value: { name: CompletionStatusName }) => boolean;
	}>;

export const makeCompletionStatus = (
	props: MakeCompletionStatusProps,
	{ clock }: MakeCompletionStatusDeps,
): CompletionStatus => {
	const now = clock.now();

	const _id: CompletionStatusId = props.id;
	let _name: CompletionStatusName = props.name;
	let _last_updated_at = props.lastUpdatedAt ?? now;
	const _created_at = props.createdAt ?? now;

	const _validate = () => {
		if (validation.isNullOrEmptyString(_name))
			throw new InvalidStateError("Completion status name must not be empty");
	};

	const _touch = () => {
		_last_updated_at = clock.now();
	};

	_validate();

	const softDelete = makeSoftDeletable(
		{ deletedAt: props.deletedAt, deleteAfter: props.deleteAfter },
		{ clock, touch: _touch, validate: _validate },
	);

	const completionStatus: CompletionStatus = {
		getId: () => _id,
		getSafeId: () => _id,
		getName: () => _name,
		getLastUpdatedAt: () => _last_updated_at,
		getCreatedAt: () => _created_at,
		updateFromPlaynite: ({ name }) => {
			if (name === _name) return false;

			_name = name;
			_touch();
			_validate();
			return true;
		},
		validate: _validate,
		...softDelete,
	};
	return Object.freeze(completionStatus);
};

export const rehydrateCompletionStatus = (
	props: RehydrateCompletionStatusProps,
	deps: MakeCompletionStatusDeps,
) => makeCompletionStatus(props, deps);
