import { faker } from "@faker-js/faker";
import { CompanyIdParser } from "@playatlas/common/domain";
import type { TestEntityFactory } from "@playatlas/common/testing";
import type { ICompanyFactoryPort } from "../application/company.factory";
import { type Company } from "../domain/company.entity";
import type { MakeCompanyProps } from "../domain/company.entity.types";

export type CompanyFactory = TestEntityFactory<MakeCompanyProps, Company>;

export type CompanyFactoryDeps = {
	companyFactory: ICompanyFactoryPort;
};

export const makeCompanyFactory = ({ companyFactory }: CompanyFactoryDeps): CompanyFactory => {
	const build: CompanyFactory["build"] = (props = {}) => {
		return companyFactory.create({
			id: CompanyIdParser.fromExternal(props.id ?? faker.string.uuid()),
			name: props.name ?? faker.company.name(),
			lastUpdatedAt: props.lastUpdatedAt ?? faker.date.recent(),
		});
	};

	const buildList: CompanyFactory["buildList"] = (n, props = {}) => {
		return Array.from({ length: n }, () => build(props));
	};

	return { build, buildList };
};
