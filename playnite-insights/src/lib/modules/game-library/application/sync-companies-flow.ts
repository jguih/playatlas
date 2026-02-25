import type { IPlayAtlasClientPort } from "$lib/modules/common/application/playatlas-client.port";
import type { CompanyResponseDto } from "@playatlas/game-library/dtos";
import type {
	ISyncRunnerPort,
	SyncRunnerFetchResult,
} from "../../common/application/sync-runner.port";
import type { ISyncCompaniesCommandHandlerPort } from "../commands";
import type { ICompanyMapperPort } from "./company.mapper.port";

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
