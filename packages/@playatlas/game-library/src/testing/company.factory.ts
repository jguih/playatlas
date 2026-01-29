import { faker } from "@faker-js/faker";
import { CompanyIdParser, PlayniteCompanyIdParser } from "@playatlas/common/domain";
import type { TestEntityFactory } from "@playatlas/common/testing";
import { monotonicFactory } from "ulid";
import type { ICompanyFactoryPort } from "../application/company.factory";
import { type Company } from "../domain/company.entity";
import type { MakeCompanyProps } from "../domain/company.entity.types";

export type TestCompanyFactory = TestEntityFactory<MakeCompanyProps, Company>;

export type TestCompanyFactoryDeps = {
	companyFactory: ICompanyFactoryPort;
};

export const makeTestCompanyFactory = ({
	companyFactory,
}: TestCompanyFactoryDeps): TestCompanyFactory => {
	const p = <T, V>(value: V, prop?: T) => {
		if (prop === undefined) return value;
		return prop;
	};

	const createBuilder = (ulid = monotonicFactory()) => ({
		build: (props: Partial<MakeCompanyProps> = {}) => {
			return companyFactory.create({
				id: p(CompanyIdParser.fromTrusted(ulid()), props.id),
				playniteId: p(PlayniteCompanyIdParser.fromTrusted(faker.string.uuid()), props.playniteId),
				name: p(faker.company.name(), props.name),
			});
		},
	});

	const buildList: TestCompanyFactory["buildList"] = (n, props = {}) => {
		const builder = createBuilder();
		return Array.from({ length: n }, () => builder.build(props));
	};

	const build: TestCompanyFactory["build"] = (props = {}) => {
		return createBuilder().build(props);
	};

	return { build, buildList };
};
