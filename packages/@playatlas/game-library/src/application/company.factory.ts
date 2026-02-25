import type { IEntityFactoryPort } from "@playatlas/common/application";
import { CompanyIdParser } from "@playatlas/common/domain";
import type { IClockPort } from "@playatlas/common/infra";
import { monotonicFactory } from "ulid";
import { makeCompany, rehydrateCompany, type Company } from "../domain/company.entity";
import type { MakeCompanyProps, RehydrateCompanyProps } from "../domain/company.entity.types";

type MakeCompanyPropsWithOptionalId = Omit<MakeCompanyProps, "id"> & {
	id?: MakeCompanyProps["id"];
};

export type ICompanyFactoryPort = IEntityFactoryPort<
	MakeCompanyPropsWithOptionalId,
	RehydrateCompanyProps,
	Company
>;

export type CompanyFactoryDeps = {
	clock: IClockPort;
};

export const makeCompanyFactory = (deps: CompanyFactoryDeps): ICompanyFactoryPort => {
	const ulid = monotonicFactory();

	return {
		create: (props) =>
			makeCompany({ ...props, id: props.id ?? CompanyIdParser.fromTrusted(ulid()) }, deps),
		rehydrate: (props) => rehydrateCompany(props, deps),
	};
};
