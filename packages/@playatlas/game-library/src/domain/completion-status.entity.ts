import { validation } from "@playatlas/common/application";
import { makeSoftDeletable, type EntitySoftDeleteProps } from "@playatlas/common/common";
import {
	InvalidStateError,
	type BaseEntity,
	type CompletionStatusId,
	type PlayniteCompletionStatusId,
} from "@playatlas/common/domain";
import type {
	MakeCompletionStatusDeps,
	MakeCompletionStatusProps,
	RehydrateCompletionStatusProps,
	UpdateCompletionStatusFromPlayniteProps,
} from "./completion-status.entity.types";

export type CompletionStatusName = string;

export type CompletionStatus = BaseEntity<CompletionStatusId> &
	EntitySoftDeleteProps &
	Readonly<{
		getName: () => CompletionStatusName;
		getPlayniteId: () => PlayniteCompletionStatusId | null;
		updateFromPlaynite: (value: UpdateCompletionStatusFromPlayniteProps) => boolean;
	}>;

export const makeCompletionStatus = (
	props: MakeCompletionStatusProps,
	{ clock }: MakeCompletionStatusDeps,
): CompletionStatus => {
	const now = clock.now();

	const _id: CompletionStatusId = props.id;
	let _playnite_id = props.playniteId ?? null;
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
		getPlayniteId: () => _playnite_id,
		getName: () => _name,
		getLastUpdatedAt: () => _last_updated_at,
		getCreatedAt: () => _created_at,
		updateFromPlaynite: ({ name, playniteId }) => {
			let updated = false;

			if (_name !== name) updated = true;
			if (_playnite_id !== playniteId) updated = true;

			if (!updated) return updated;

			_name = name;
			_playnite_id = playniteId;

			_touch();
			_validate();
			return updated;
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
