import type { IQueryHandlerPort } from "@playatlas/common/application";
import { computeNextSyncCursor } from "@playatlas/common/infra";
import type { CompanyRepositoryFilters } from "../../infra/company.repository.types";
import type { GetAllCompaniesQuery } from "./get-all-companies.query";
import type {
	GetAllCompaniesQueryHandlerDeps,
	GetAllCompaniesQueryResult,
} from "./get-all-companies.query.types";

export type IGetAllCompaniesQueryHandlerPort = IQueryHandlerPort<
	GetAllCompaniesQuery,
	GetAllCompaniesQueryResult
>;

export const makeGetAllCompaniesQueryHandler = ({
	companyRepository,
	companyMapper,
	logService,
	clock,
}: GetAllCompaniesQueryHandlerDeps): IGetAllCompaniesQueryHandlerPort => {
	return {
		execute: ({ lastCursor } = {}) => {
			const filters: CompanyRepositoryFilters | undefined = lastCursor
				? {
						syncCursor: lastCursor,
					}
				: undefined;

			const companies = companyRepository.all(filters);

			if (lastCursor) {
				const elapsedMs = clock.now().getTime() - lastCursor.lastUpdatedAt.getTime();
				const elapsedSeconds = Math.floor(elapsedMs / 1000);
				logService.debug(
					`Found ${companies.length} companies (updated since last sync: ${elapsedSeconds}s ago)`,
				);
			} else {
				logService.debug(`Found ${companies.length} companies (no filters)`);
			}

			const companyDtos = companyMapper.toDtoList(companies);
			const nextCursor = computeNextSyncCursor(companies, lastCursor);

			return { data: companyDtos, nextCursor };
		},
	};
};
