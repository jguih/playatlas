import type { IGameLibrarySyncManagerPort } from "./game-library-sync-manager.port";
import type { ISyncCompaniesFlowPort } from "./sync-companies-flow.port";
import type { ISyncCompletionStatusesFlowPort } from "./sync-completion-statuses-flow.port";
import type { ISyncGamesFlowPort } from "./sync-games-flow.port";

export type GameLibrarySyncManagerDeps = {
	syncGamesFlow: ISyncGamesFlowPort;
	syncCompletionStatusesFlow: ISyncCompletionStatusesFlowPort;
	syncCompaniesFlow: ISyncCompaniesFlowPort;
};

export class GameLibrarySyncManager implements IGameLibrarySyncManagerPort {
	private readonly syncGamesFlow: ISyncGamesFlowPort;
	private readonly syncCompletionStatusesFlow: ISyncCompletionStatusesFlowPort;
	private readonly syncCompaniesFlow: ISyncCompaniesFlowPort;

	constructor({
		syncGamesFlow,
		syncCompletionStatusesFlow,
		syncCompaniesFlow,
	}: GameLibrarySyncManagerDeps) {
		this.syncGamesFlow = syncGamesFlow;
		this.syncCompletionStatusesFlow = syncCompletionStatusesFlow;
		this.syncCompaniesFlow = syncCompaniesFlow;
	}

	executeAsync: IGameLibrarySyncManagerPort["executeAsync"] = async () => {
		await Promise.all([
			this.syncGamesFlow.executeAsync(),
			this.syncCompletionStatusesFlow.executeAsync(),
			this.syncCompaniesFlow.executeAsync(),
		]);
	};
}
