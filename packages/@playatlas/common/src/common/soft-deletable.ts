import { InvalidStateError } from "../domain";
import type { IClockPort } from "../infra";

export type EntitySoftDeleteProps = {
	getDeletedAt: () => Date | null;
	getDeleteAfter: () => Date | null;
	delete: () => void;
};

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

export const makeSoftDeletable = (
	props: {
		deletedAt?: Date | null;
		deleteAfter?: Date | null;
	},
	deps: {
		clock: IClockPort;
		touch: () => void;
		validate: () => void;
	},
) => {
	let _deleted_at = props.deletedAt ?? null;
	let _delete_after = props.deleteAfter ?? null;

	const _validate = () => {
		if (_deleted_at && !_delete_after)
			throw new InvalidStateError("DeleteAfter must be defined if entity was deleted");
		if (!_deleted_at && _delete_after)
			throw new InvalidStateError("DeletedAt must be defined if entity was deleted");
	};

	_validate();

	const softDelete = () => {
		_deleted_at = deps.clock.now();
		_delete_after = new Date(_deleted_at.getTime() + THIRTY_DAYS);
		_validate();
		deps.touch();
		deps.validate();
	};

	return {
		getDeletedAt: () => _deleted_at,
		getDeleteAfter: () => _delete_after,
		delete: softDelete,
	};
};
