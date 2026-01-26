import { ISODateSchema } from "@playatlas/common/common";
import { companyIdSchema } from "@playatlas/common/domain";
import { makeBaseRepository, type BaseRepositoryDeps } from "@playatlas/common/infra";
import z from "zod";
import type { ICompanyMapperPort } from "../application";
import type { ICompanyRepositoryPort } from "./company.repository.port";
import type { CompanyRepositoryFilters } from "./company.repository.types";

export const companySchema = z.object({
	Id: companyIdSchema,
	Name: z.string(),
	LastUpdatedAt: ISODateSchema,
	CreatedAt: ISODateSchema,
	DeletedAt: ISODateSchema.nullable(),
	DeleteAfter: ISODateSchema.nullable(),
});

export type CompanyModel = z.infer<typeof companySchema>;

export type CompanyRepositoryDeps = BaseRepositoryDeps & {
	companyMapper: ICompanyMapperPort;
};

export const makeCompanyRepository = ({
	getDb,
	logService,
	companyMapper,
}: CompanyRepositoryDeps): ICompanyRepositoryPort => {
	const TABLE_NAME = "playnite_company";
	const COLUMNS: (keyof CompanyModel)[] = [
		"Id",
		"Name",
		"LastUpdatedAt",
		"CreatedAt",
		"DeletedAt",
		"DeleteAfter",
	];

	const getWhereClauseAndParamsFromFilters = (filters?: CompanyRepositoryFilters) => {
		const where: string[] = [];
		const params: (string | number)[] = [];

		if (!filters) {
			return { where: "", params };
		}

		if (filters.lastUpdatedAt !== undefined) {
			for (const startTimeFilter of filters.lastUpdatedAt) {
				switch (startTimeFilter.op) {
					case "between": {
						where.push(`LastUpdatedAt >= (?) AND LastUpdatedAt < (?)`);
						params.push(startTimeFilter.start.toISOString(), startTimeFilter.end.toISOString());
						break;
					}
					case "eq": {
						where.push(`LastUpdatedAt = (?)`);
						params.push(startTimeFilter.value.toISOString());
						break;
					}
					case "gte": {
						where.push(`LastUpdatedAt > (?)`);
						params.push(startTimeFilter.value.toISOString());
						break;
					}
					case "lte": {
						where.push(`LastUpdatedAt < (?)`);
						params.push(startTimeFilter.value.toISOString());
						break;
					}
					case "overlaps": {
						where.push(`LastUpdatedAt < (?) AND LastUpdatedAt >= (?)`);
						params.push(startTimeFilter.end.toISOString(), startTimeFilter.start.toISOString());
						break;
					}
				}
			}
		}

		return {
			where: where.length > 0 ? `WHERE ${where.join(" AND ")}` : "",
			params,
		};
	};

	const base = makeBaseRepository({
		getDb,
		logService,
		config: {
			tableName: TABLE_NAME,
			idColumn: "Id",
			insertColumns: COLUMNS,
			updateColumns: COLUMNS.filter((c) => c !== "Id"),
			mapper: companyMapper,
			modelSchema: companySchema,
			getWhereClauseAndParamsFromFilters,
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
