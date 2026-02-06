import { validation } from "@playatlas/common/application";
import { InvalidStateError, type BaseEntity } from "@playatlas/common/domain";
import type { ClassificationId } from "../value-object";
import type { ClassificationCategory } from "../value-object/classification-category";
import type {
	MakeClassificationDeps,
	MakeClassificationProps,
	RehydrateClassificationProps,
} from "./classification.entity.types";

export type Classification = BaseEntity<ClassificationId> &
	Readonly<{
		getDisplayName: () => string;
		getDescription: () => string;
		getCategory: () => ClassificationCategory;
	}>;

export const makeClassificationAggregate = (
	props: MakeClassificationProps,
	{ clock }: MakeClassificationDeps,
): Classification => {
	const now = clock.now();

	const id = props.id;
	const displayName = props.displayName;
	const description = props.description;
	const category = props.category;
	const lastUpdatedAt = props.lastUpdatedAt ?? now;
	const createdAt = props.createdAt ?? now;

	const _validate = () => {
		if (validation.isNullOrEmptyString(displayName))
			throw new InvalidStateError(validation.message.isNullOrEmptyString("displayName"));
		if (validation.isNullOrEmptyString(description))
			throw new InvalidStateError(validation.message.isNullOrEmptyString("description"));
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
		validate: _validate,
	};
	return Object.freeze(aggregate);
};

export const rehydrateClassificationAggregate = (
	props: RehydrateClassificationProps,
	deps: MakeClassificationDeps,
) => makeClassificationAggregate(props, deps);
