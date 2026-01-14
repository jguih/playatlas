import type { IClientEntityFactoryPort } from "$lib/modules/common/testing";
import { faker } from "@faker-js/faker";
import type { Company } from "../domain/company.entity";

export type ICompanyFactoryPort = IClientEntityFactoryPort<Company>;

export class CompanyFactory implements ICompanyFactoryPort {
	private buildCompany = (): Company => {
		return {
			Id: faker.string.uuid(),
			Name: faker.word.noun(),
			SourceUpdatedAt: faker.date.recent(),
		};
	};

	build: ICompanyFactoryPort["build"] = () => {
		return this.buildCompany();
	};

	buildList: ICompanyFactoryPort["buildList"] = (n) => {
		return Array.from({ length: n }, () => this.buildCompany());
	};
}
