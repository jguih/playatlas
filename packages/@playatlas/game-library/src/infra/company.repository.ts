import { makeBaseRepository, type BaseRepositoryDeps } from "@playatlas/common/infra";
import z from "zod";
import { companyMapper } from "../company.mapper";
import type { Company, CompanyId } from "../domain/company.entity";
import type { ICompanyRepositoryPort } from "./company.repository.port";

export const companySchema = z.object({
	Id: z.string(),
	Name: z.string(),
});

export type CompanyModel = z.infer<typeof companySchema>;

export const makeCompanyRepository = ({
	getDb,
	logService,
}: BaseRepositoryDeps): ICompanyRepositoryPort => {
	const TABLE_NAME = "company";
	const COLUMNS: (keyof CompanyModel)[] = ["Id", "Name"];
	const base = makeBaseRepository<CompanyId, Company, CompanyModel>({
		getDb,
		logService,
		config: {
			tableName: TABLE_NAME,
			idColumn: "Id",
			insertColumns: COLUMNS,
			updateColumns: COLUMNS.filter((c) => c !== "Id"),
			mapper: companyMapper,
			modelSchema: companySchema,
		},
	});

	const add: ICompanyRepositoryPort["add"] = (company) => {
		base._add(company);
	};

	const upsert: ICompanyRepositoryPort["upsert"] = (company) => {
		base._upsert(company);
	};

	const update: ICompanyRepositoryPort["update"] = (company) => {
		base._update(company);
	};

	return {
		...base.public,
		add,
		upsert,
		update,
	};
};
