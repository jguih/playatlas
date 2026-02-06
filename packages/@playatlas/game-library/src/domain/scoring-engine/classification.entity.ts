import { validation } from "@playatlas/common/application";
import { InvalidStateError, type BaseEntity } from "@playatlas/common/domain";
import type { ClassificationId } from "../value-object";
import type { ClassificationCategory } from "../value-object/classification-category";
import type {
	MakeClassificationDeps,
	MakeClassificationProps,
	RehydrateClassificationProps,
	UpdateClassificationProps,
} from "./classification.entity.types";

export type Classification = BaseEntity<ClassificationId> &
	Readonly<{
		getDisplayName: () => string;
		getDescription: () => string;
		getCategory: () => ClassificationCategory;
		getVersion: () => string;
		update: (value: UpdateClassificationProps) => boolean;
	}>;

export const makeClassificationAggregate = (
	props: MakeClassificationProps,
	{ clock }: MakeClassificationDeps,
): Classification => {
	const now = clock.now();

	const id = props.id;
	let displayName = props.displayName;
	let description = props.description;
	let category = props.category;
	let version = props.version;
	let lastUpdatedAt = props.lastUpdatedAt ?? now;
	const createdAt = props.createdAt ?? now;

	const _touch = () => {
		lastUpdatedAt = clock.now();
	};

	const _validate = () => {
		if (validation.isNullOrEmptyString(displayName))
			throw new InvalidStateError(validation.message.isNullOrEmptyString("displayName"));
		if (validation.isNullOrEmptyString(description))
			throw new InvalidStateError(validation.message.isNullOrEmptyString("description"));
		if (validation.isNullOrEmptyString(version))
			throw new InvalidStateError(validation.message.isNullOrEmptyString("version"));
	};

	_validate();

	const aggregate: Classification = {
		getId: () => id,
		getSafeId: () => id,
		getLastUpdatedAt: () => lastUpdatedAt,
		getCreatedAt: () => createdAt,
		getDisplayName: () => displayName,
		getDescription: () => description,
		getCategory: () => category,
		getVersion: () => version,
		update: (value) => {
			let didUpdate = false;

			if (version !== value.version) didUpdate = true;

			if (!didUpdate) return didUpdate;

			displayName = value.displayName;
			description = value.description;
			category = value.category;
			version = value.version;

			_touch();
			_validate();
			return didUpdate;
		},
		validate: _validate,
	};
	return Object.freeze(aggregate);
};

export const rehydrateClassificationAggregate = (
	props: RehydrateClassificationProps,
	deps: MakeClassificationDeps,
) => makeClassificationAggregate(props, deps);
