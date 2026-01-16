import { validation } from "@playatlas/common/application";
import { InvalidStateError, type BaseEntity, type CompanyId } from "@playatlas/common/domain";
import type { MakeCompanyProps } from "./company.entity.types";

type CompanyName = string;

export type Company = BaseEntity<CompanyId> &
	Readonly<{
		getName: () => CompanyName;
	}>;

export const makeCompany = (props: MakeCompanyProps): Company => {
	const _id: CompanyId = props.id;
	const _name: CompanyName = props.name;
	const _last_updated_at = props.lastUpdatedAt;
	const _created_at = props.createdAt ?? new Date();

	const _validate = () => {
		if (validation.isNullOrEmptyString(_name))
			throw new InvalidStateError("Company name must not be empty");
	};

	_validate();

	const company: Company = {
		getId: () => _id,
		getSafeId: () => _id,
		getName: () => _name,
		getLastUpdatedAt: () => _last_updated_at,
		getCreatedAt: () => _created_at,
		validate: _validate,
	};
	return Object.freeze(company);
};
