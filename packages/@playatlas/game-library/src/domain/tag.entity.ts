import { validation } from "@playatlas/common/application";
import {
	InvalidStateError,
	makeSoftDeletable,
	type BaseEntity,
	type EntitySoftDeleteProps,
	type TagId,
} from "@playatlas/common/domain";
import type {
	MakeTagDeps,
	MakeTagProps,
	PlayniteTagSnapshot,
	RehydrateTagProps,
	UpdateTagFromPlayniteProps,
} from "./tag.entity.types";

export type TagName = string;

export type Tag = BaseEntity<TagId> &
	EntitySoftDeleteProps &
	Readonly<{
		getName: () => TagName;
		getPlayniteSnapshot: () => PlayniteTagSnapshot | null;
		updateFromPlaynite: (value: UpdateTagFromPlayniteProps) => boolean;
	}>;

export const makeTag = (props: MakeTagProps, { clock }: MakeTagDeps): Tag => {
	const now = clock.now();

	const id: TagId = props.id;
	let playniteSnapshot = props.playniteSnapshot ?? null;
	let name: TagName = props.name;
	let lastUpdatedAt = props.lastUpdatedAt ?? now;
	const createdAt = props.createdAt ?? now;

	const _touch = () => {
		lastUpdatedAt = clock.now();
	};

	const _validate = () => {
		if (validation.isNullOrEmptyString(name))
			throw new InvalidStateError(validation.message.isNullOrEmptyString("name"));
	};

	_validate();

	const softDelete = makeSoftDeletable(
		{ deletedAt: props.deletedAt, deleteAfter: props.deleteAfter },
		{ clock, touch: _touch, validate: _validate },
	);

	const tag: Tag = {
		getId: () => id,
		getSafeId: () => id,
		getPlayniteSnapshot: () => playniteSnapshot,
		getName: () => name,
		getLastUpdatedAt: () => lastUpdatedAt,
		getCreatedAt: () => createdAt,
		updateFromPlaynite: (props) => {
			let updated = false;

			if (name !== name) updated = true;
			if (props.playniteSnapshot.id !== playniteSnapshot?.id) updated = true;

			if (!updated) return updated;

			name = props.name;
			playniteSnapshot = props.playniteSnapshot;

			_touch();
			_validate();
			return updated;
		},
		validate: _validate,
		...softDelete,
	};
	return Object.freeze(tag);
};

export const rehydrateTag = (props: RehydrateTagProps, deps: MakeTagDeps) => makeTag(props, deps);
