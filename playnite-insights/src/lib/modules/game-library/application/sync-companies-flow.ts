import type { CompanyResponseDto } from "@playatlas/game-library/dtos";
import type { ISyncCompaniesCommandHandlerPort } from "../commands";
import type { ICompanyMapperPort } from "./company.mapper.port";
import type { IPlayAtlasClientPort } from "./playatlas-client.port";
import type { ISyncRunnerPort, SyncRunnerFetchResult } from "./sync-runner";

export type ISyncCompaniesFlowPort = {
	executeAsync: () => Promise<void>;
};

export type SyncCompaniesFlowDeps = {
	playAtlasClient: IPlayAtlasClientPort;
	syncCompaniesCommandHandler: ISyncCompaniesCommandHandlerPort;
	companyMapper: ICompanyMapperPort;
	syncRunner: ISyncRunnerPort;
};

export class SyncCompaniesFlow implements ISyncCompaniesFlowPort {
	constructor(private readonly deps: SyncCompaniesFlowDeps) {}

	private fetchAsync = async ({
		lastCursor,
	}: {
		lastCursor: string | null;
	}): Promise<SyncRunnerFetchResult<CompanyResponseDto>> => {
		const response = await this.deps.playAtlasClient.getCompaniesAsync({
			lastCursor,
		});

		if (!response.success) return { success: false };

		return {
			success: true,
			items: response.companies,
			nextCursor: response.nextCursor,
		};
	};

	executeAsync: ISyncCompaniesFlowPort["executeAsync"] = async () => {
		const { companyMapper, syncCompaniesCommandHandler, syncRunner } = this.deps;

		await syncRunner.runAsync({
			syncTarget: "companies",
			fetchAsync: this.fetchAsync,
			mapDtoToEntity: ({ dto, now }) => companyMapper.fromDto(dto, now),
			persistAsync: ({ entities }) =>
				syncCompaniesCommandHandler.executeAsync({ companies: entities }),
		});
	};
}
