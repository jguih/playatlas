import type { IClientEntityFactoryPort } from "$lib/modules/common/testing";
import { faker } from "@faker-js/faker";
import { CompanyIdParser, type Company } from "../domain/company.entity";

export type ICompanyFactoryPort = IClientEntityFactoryPort<Company>;

export class CompanyFactory implements ICompanyFactoryPort {
	private buildCompany = (): Company => {
		return {
			Id: CompanyIdParser.fromTrusted(faker.string.ulid()),
			Name: faker.word.noun(),
			SourceLastUpdatedAt: faker.date.recent(),
			Sync: {
				Status: "synced",
				ErrorMessage: null,
				LastSyncedAt: faker.date.recent(),
			},
		};
	};

	build: ICompanyFactoryPort["build"] = () => {
		return this.buildCompany();
	};

	buildList: ICompanyFactoryPort["buildList"] = (n) => {
		return Array.from({ length: n }, () => this.buildCompany());
	};
}
