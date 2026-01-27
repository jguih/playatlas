import type { IClockPort } from "$lib/modules/common/application";
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
	clock: IClockPort;
};

export class SyncCompaniesFlow implements ISyncCompaniesFlowPort {
	private readonly gameLibrarySyncState: IGameLibrarySyncStatePort;
	private readonly playAtlasClient: IPlayAtlasClientPort;
	private readonly syncCompaniesCommandHandler: ISyncCompaniesCommandHandlerPort;
	private readonly companyMapper: ICompanyMapperPort;
	private readonly clock: IClockPort;

	constructor({
		companyMapper,
		gameLibrarySyncState,
		playAtlasClient,
		syncCompaniesCommandHandler,
		clock,
	}: SyncCompaniesFlowDeps) {
		this.gameLibrarySyncState = gameLibrarySyncState;
		this.playAtlasClient = playAtlasClient;
		this.syncCompaniesCommandHandler = syncCompaniesCommandHandler;
		this.companyMapper = companyMapper;
		this.clock = clock;
	}

	executeAsync: ISyncCompaniesFlowPort["executeAsync"] = async () => {
		const now = this.clock.now();
		const lastCursor = this.gameLibrarySyncState.getLastServerSyncCursor("companies");

		const response = await this.playAtlasClient.getCompaniesAsync({
			lastCursor,
		});

		if (!response.success) return;

		const companies = response.companies.map((g) => this.companyMapper.fromDto(g, now));

		await this.syncCompaniesCommandHandler.executeAsync({ companies });

		this.gameLibrarySyncState.setLastServerSyncCursor("companies", response.nextCursor);
	};
}
