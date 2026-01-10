import type { IAsyncCommandHandlerPort } from '$lib/modules/common/common';
import type { ICompanyRepositoryPort } from '../../infra/company.repository.port';
import type { SyncCompaniesCommand } from './sync-companies.command';

export type ISyncCompaniesCommandHandlerPort = IAsyncCommandHandlerPort<SyncCompaniesCommand, void>;

export type SyncCompaniesCommandHandlerDeps = {
	companyRepository: ICompanyRepositoryPort;
};

export class SyncCompaniesCommandHandler implements ISyncCompaniesCommandHandlerPort {
	private readonly companyRepository: ICompanyRepositoryPort;

	constructor({ companyRepository }: SyncCompaniesCommandHandlerDeps) {
		this.companyRepository = companyRepository;
	}

	async executeAsync(command: SyncCompaniesCommand): Promise<void> {
		await this.companyRepository.syncAsync(command.companies);
	}
}
