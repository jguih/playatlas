import type { BaseEntity, CompanyId } from "@playatlas/common/domain";
import type { MakeCompanyProps } from "./company.entity.types";

type CompanyName = string;

export type Company = BaseEntity<CompanyId> &
	Readonly<{
		getName: () => CompanyName;
	}>;

export const makeCompany = (props: MakeCompanyProps): Company => {
	const _id: CompanyId = props.id;
	const _name: CompanyName = props.name;

	const company: Company = {
		getId: () => _id,
		getSafeId: () => _id,
		getName: () => _name,
		validate: () => {},
	};
	return Object.freeze(company);
};
