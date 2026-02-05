import { validation } from "@playatlas/common/application";
import {
	InvalidStateError,
	makeSoftDeletable,
	type BaseEntity,
	type EntitySoftDeleteProps,
	type PlatformId,
} from "@playatlas/common/domain";
import type {
	MakePlatformDeps,
	MakePlatformProps,
	PlaynitePlatformSnapshot,
	RehydratePlatformProps,
	UpdatePlatformFromPlayniteProps,
} from "./platform.entity.types";

export type PlatformName = string;

export type Platform = BaseEntity<PlatformId> &
	EntitySoftDeleteProps &
	Readonly<{
		getName: () => PlatformName;
		getPlayniteSnapshot: () => PlaynitePlatformSnapshot | null;
		updateFromPlaynite: (value: UpdatePlatformFromPlayniteProps) => boolean;
	}>;

export const makePlatform = (props: MakePlatformProps, { clock }: MakePlatformDeps): Platform => {
	const now = clock.now();

	const _id = props.id;
	let _name = props.name;
	let _playnite_snapshot = props.playniteSnapshot ?? null;
	let _last_updated_at = props.lastUpdatedAt ?? now;
	const _created_at = props.createdAt ?? now;

	const _touch = () => {
		_last_updated_at = clock.now();
	};

	const _validate = () => {
		if (validation.isNullOrEmptyString(_name))
			throw new InvalidStateError("Platform name must not be empty");
	};

	_validate();

	const softDelete = makeSoftDeletable(
		{ deleteAfter: props.deleteAfter, deletedAt: props.deletedAt },
		{ clock, touch: _touch, validate: _validate },
	);

	const platform: Platform = {
		getId: () => _id,
		getSafeId: () => _id,
		getName: () => _name,
		getPlayniteSnapshot: () => _playnite_snapshot,
		getLastUpdatedAt: () => _last_updated_at,
		getCreatedAt: () => _created_at,
		updateFromPlaynite: ({ playniteSnapshot, name }) => {
			let updated = false;

			if (_playnite_snapshot?.id !== playniteSnapshot.id) updated = true;
			if (_playnite_snapshot?.specificationId !== playniteSnapshot.specificationId) updated = true;
			if (_name !== name) updated = true;

			if (!updated) return updated;

			_playnite_snapshot = playniteSnapshot;
			_name = name;

			_touch();
			_validate();
			return updated;
		},
		...softDelete,
		validate: _validate,
	};

	return Object.freeze(platform);
};

export const rehydratePlatform = (props: RehydratePlatformProps, deps: MakePlatformDeps) =>
	makePlatform(props, deps);
