import type { ICompanyRepositoryPort } from "../../infra/company.repository.port";
import type {
	GetCompaniesByIdsQuery,
	GetCompaniesByIdsQueryResult,
} from "./get-companies-by-ids.query";
import type { IGetCompaniesByIdsQueryHandlerPort } from "./get-companies-by-ids.query-handler.port";

export type GetCompaniesByIdsQueryHandlerDeps = {
	companyRepository: ICompanyRepositoryPort;
};

export class GetCompaniesByIdsQueryHandler implements IGetCompaniesByIdsQueryHandlerPort {
	private readonly companyRepository: ICompanyRepositoryPort;

	constructor({ companyRepository }: GetCompaniesByIdsQueryHandlerDeps) {
		this.companyRepository = companyRepository;
	}

	async executeAsync({
		companyIds,
	}: GetCompaniesByIdsQuery): Promise<GetCompaniesByIdsQueryResult> {
		const companies = await this.companyRepository.getByIdsAsync(companyIds);
		return { companies };
	}
}
