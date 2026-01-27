import type { IGameLibrarySyncManagerPort } from "./game-library-sync-manager.port";
import type { ISyncCompaniesFlowPort } from "./sync-companies-flow";
import type { ISyncCompletionStatusesFlowPort } from "./sync-completion-statuses-flow";
import type { ISyncGamesFlowPort } from "./sync-games-flow";
import type { ISyncGenresFlowPort } from "./sync-genres-flow";

export type GameLibrarySyncManagerDeps = {
	syncGamesFlow: ISyncGamesFlowPort;
	syncCompletionStatusesFlow: ISyncCompletionStatusesFlowPort;
	syncCompaniesFlow: ISyncCompaniesFlowPort;
	syncGenresFlow: ISyncGenresFlowPort;
};

export class GameLibrarySyncManager implements IGameLibrarySyncManagerPort {
	constructor(private readonly deps: GameLibrarySyncManagerDeps) {}

	executeAsync: IGameLibrarySyncManagerPort["executeAsync"] = async () => {
		const { syncCompaniesFlow, syncCompletionStatusesFlow, syncGamesFlow, syncGenresFlow } =
			this.deps;

		await Promise.all([
			syncGamesFlow.executeAsync(),
			syncCompletionStatusesFlow.executeAsync(),
			syncCompaniesFlow.executeAsync(),
			syncGenresFlow.executeAsync(),
		]);
	};
}
