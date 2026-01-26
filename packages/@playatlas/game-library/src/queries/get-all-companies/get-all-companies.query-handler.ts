import type { QueryHandler } from "@playatlas/common/common";
import type { CompanyResponseDto } from "../../dtos/company.response.dto";
import type { CompanyRepositoryFilters } from "../../infra/company.repository.types";
import type { GetAllCompaniesQuery } from "./get-all-companies.query";
import type {
	GetAllCompaniesQueryHandlerDeps,
	GetAllCompaniesQueryResult,
} from "./get-all-companies.query.types";

export type IGetAllCompaniesQueryHandlerPort = QueryHandler<
	GetAllCompaniesQuery,
	GetAllCompaniesQueryResult
>;

export const makeGetAllCompaniesQueryHandler = ({
	companyRepository,
	companyMapper,
	logService,
	clock,
}: GetAllCompaniesQueryHandlerDeps): IGetAllCompaniesQueryHandlerPort => {
	const computeNextCursor = (dtos: CompanyResponseDto[], since?: Date | null): Date => {
		const baseCursor = since ?? new Date(0);

		if (dtos.length === 0) {
			return baseCursor;
		}

		return dtos.reduce<Date>((latest, completionStatus) => {
			const updatedAt = new Date(completionStatus.Sync.LastUpdatedAt);
			return updatedAt > latest ? updatedAt : latest;
		}, baseCursor);
	};

	return {
		execute: ({ since } = {}) => {
			const filters: CompanyRepositoryFilters | undefined = since
				? {
						lastUpdatedAt: [{ op: "gte", value: since }],
					}
				: undefined;

			const companies = companyRepository.all(filters);

			if (since) {
				const elapsedMs = clock.now().getTime() - since.getTime();
				const elapsedSeconds = Math.floor(elapsedMs / 1000);
				logService.debug(
					`Found ${companies.length} companies (updated since last sync: ${elapsedSeconds}s ago)`,
				);
			} else {
				logService.debug(`Found ${companies.length} companies (no filters)`);
			}

			const companyDtos = companyMapper.toDtoList(companies);
			const nextCursor = computeNextCursor(companyDtos, since).toISOString();

			return { data: companyDtos, nextCursor };
		},
	};
};
