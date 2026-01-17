import type { IEntityFactoryPort } from "@playatlas/common/application";
import type { IClockPort } from "@playatlas/common/infra";
import { makeCompany, rehydrateCompany, type Company } from "../domain/company.entity";
import type { MakeCompanyProps, RehydrateCompanyProps } from "../domain/company.entity.types";

export type ICompanyFactoryPort = IEntityFactoryPort<
	MakeCompanyProps,
	RehydrateCompanyProps,
	Company
>;

export type CompanyFactoryDeps = {
	clock: IClockPort;
};

export const makeCompanyFactory = (deps: CompanyFactoryDeps): ICompanyFactoryPort => {
	return {
		create: (props) => makeCompany(props, deps),
		rehydrate: (props) => rehydrateCompany(props, deps),
	};
};
