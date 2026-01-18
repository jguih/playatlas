import { validation } from "@playatlas/common/application";
import { makeSoftDeletable, type EntitySoftDeleteProps } from "@playatlas/common/common";
import { InvalidStateError, type BaseEntity, type CompanyId } from "@playatlas/common/domain";
import type {
	MakeCompanyDeps,
	MakeCompanyProps,
	RehydrateCompanyProps,
} from "./company.entity.types";

type CompanyName = string;

export type Company = BaseEntity<CompanyId> &
	EntitySoftDeleteProps &
	Readonly<{
		getName: () => CompanyName;
		updateFromPlaynite: (value: { name: CompanyName }) => boolean;
	}>;

export const makeCompany = (props: MakeCompanyProps, { clock }: MakeCompanyDeps): Company => {
	const now = clock.now();

	const _id: CompanyId = props.id;
	let _name: CompanyName = props.name;
	let _last_updated_at = props.lastUpdatedAt ?? now;
	const _created_at = props.createdAt ?? now;

	const _validate = () => {
		if (validation.isNullOrEmptyString(_name))
			throw new InvalidStateError("Company name must not be empty");
	};

	const _touch = () => {
		_last_updated_at = clock.now();
	};

	_validate();

	const softDelete = makeSoftDeletable(
		{ deletedAt: props.deletedAt, deleteAfter: props.deleteAfter },
		{ clock, touch: _touch, validate: _validate },
	);

	const company: Company = {
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
	return Object.freeze(company);
};

export const rehydrateCompany = (props: RehydrateCompanyProps, deps: MakeCompanyDeps) =>
	makeCompany(props, deps);
