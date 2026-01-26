import type { ISyncCompaniesCommandHandlerPort } from "../commands";
import type { ICompanyMapperPort } from "./company.mapper.port";
import type { IGameLibrarySyncStatePort } from "./game-library-sync-state.port";
import type { IPlayAtlasClientPort } from "./playatlas-client.port";
import type { ISyncCompaniesFlowPort } from "./sync-companies-flow.port";

export type SyncCompaniesFlowDeps = {
	gameLibrarySyncState: IGameLibrarySyncStatePort;
	playAtlasClient: IPlayAtlasClientPort;
	syncCompaniesCommandHandler: ISyncCompaniesCommandHandlerPort;
	companyMapper: ICompanyMapperPort;
};

export class SyncCompaniesFlow implements ISyncCompaniesFlowPort {
	private readonly gameLibrarySyncState: IGameLibrarySyncStatePort;
	private readonly playAtlasClient: IPlayAtlasClientPort;
	private readonly syncCompaniesCommandHandler: ISyncCompaniesCommandHandlerPort;
	private readonly companyMapper: ICompanyMapperPort;

	constructor({
		companyMapper,
		gameLibrarySyncState,
		playAtlasClient,
		syncCompaniesCommandHandler,
	}: SyncCompaniesFlowDeps) {
		this.gameLibrarySyncState = gameLibrarySyncState;
		this.playAtlasClient = playAtlasClient;
		this.syncCompaniesCommandHandler = syncCompaniesCommandHandler;
		this.companyMapper = companyMapper;
	}

	executeAsync: ISyncCompaniesFlowPort["executeAsync"] = async () => {
		const lastSync = this.gameLibrarySyncState.getLastServerSync("companies");

		const response = await this.playAtlasClient.getCompaniesAsync({
			sinceLastSync: lastSync,
		});

		if (!response.success) return;

		const companies = response.companies.map((g) => this.companyMapper.toDomain(g, lastSync));

		await this.syncCompaniesCommandHandler.executeAsync({ companies });

		this.gameLibrarySyncState.setLastServerSync("companies", new Date(response.nextCursor));
	};
}
