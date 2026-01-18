import { validation } from "@playatlas/common/application";
import { makeSoftDeletable, type EntitySoftDeleteProps } from "@playatlas/common/common";
import { InvalidStateError, type BaseEntity, type PlatformId } from "@playatlas/common/domain";
import type {
	MakePlatformDeps,
	MakePlatformProps,
	RehydratePlatformProps,
	UpdatePlatformFromPlayniteProps,
} from "./platform.entity.types";

export type Platform = BaseEntity<PlatformId> &
	EntitySoftDeleteProps &
	Readonly<{
		getName: () => string;
		getSpecificationId: () => string;
		getIcon: () => string | null;
		getCover: () => string | null;
		getBackground: () => string | null;
		updateFromPlaynite: (value: UpdatePlatformFromPlayniteProps) => boolean;
	}>;

export const makePlatform = (props: MakePlatformProps, { clock }: MakePlatformDeps): Platform => {
	const now = clock.now();

	const _id = props.id;
	let _name = props.name;
	let _specificationId = props.specificationId;
	let _icon = props.icon ?? null;
	let _cover = props.cover ?? null;
	let _background = props.background ?? null;
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
		getSpecificationId: () => _specificationId,
		getIcon: () => _icon,
		getCover: () => _cover,
		getBackground: () => _background,
		getLastUpdatedAt: () => _last_updated_at,
		getCreatedAt: () => _created_at,
		updateFromPlaynite: ({ name, specificationId, background, cover, icon }) => {
			let updated = false;

			if (name !== _name) {
				_name = name;
				updated = true;
			}
			if (specificationId !== _specificationId) {
				_specificationId = specificationId;
				updated = true;
			}
			if (background && background !== _background) {
				_background = background ?? null;
				updated = true;
			}
			if (cover && cover !== _cover) {
				_cover = cover ?? null;
				updated = true;
			}
			if (icon && icon !== _icon) {
				_icon = icon ?? null;
				updated = true;
			}

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
