import { validation } from "@playatlas/common/application";
import { InvalidStateError, type BaseEntity, type PlatformId } from "@playatlas/common/domain";
import type { MakePlatformProps } from "./platform.entity.types";

export type Platform = BaseEntity<PlatformId> &
	Readonly<{
		getId: () => PlatformId;
		getName: () => string;
		getSpecificationId: () => string;
		getIcon: () => string | null;
		getCover: () => string | null;
		getBackground: () => string | null;
	}>;

export const makePlatform = (props: MakePlatformProps): Platform => {
	const _id = props.id;
	const _name = props.name;
	const _specificationId = props.specificationId;
	const _icon = props.icon ?? null;
	const _cover = props.cover ?? null;
	const _background = props.background ?? null;
	const _last_updated_at = props.lastUpdatedAt;

	const _validate = () => {
		if (validation.isNullOrEmptyString(_name))
			throw new InvalidStateError("Platform name must not be empty");
	};

	_validate();

	const platform: Platform = {
		getId: () => _id,
		getSafeId: () => _id,
		getName: () => _name,
		getSpecificationId: () => _specificationId,
		getIcon: () => _icon,
		getCover: () => _cover,
		getBackground: () => _background,
		getLastUpdatedAt: () => _last_updated_at,
		validate: _validate,
	};

	return Object.freeze(platform);
};
