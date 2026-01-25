import type { IClockPort } from "$lib/modules/common/application";
import type { IGameLibrarySyncManagerPort } from "./game-library-sync-manager.port";
import type { ISyncCompletionStatusesFlowPort } from "./sync-completion-statuses-flow.port";
import type { ISyncGamesFlowPort } from "./sync-games-flow.port";

export type GameLibrarySyncManagerDeps = {
	clock: IClockPort;
	syncGamesFlow: ISyncGamesFlowPort;
	syncCompletionStatusesFlow: ISyncCompletionStatusesFlowPort;
};

export class GameLibrarySyncManager implements IGameLibrarySyncManagerPort {
	private readonly clock: IClockPort;
	private readonly syncGamesFlow: ISyncGamesFlowPort;
	private readonly syncCompletionStatusesFlow: ISyncCompletionStatusesFlowPort;

	constructor({ clock, syncGamesFlow, syncCompletionStatusesFlow }: GameLibrarySyncManagerDeps) {
		this.clock = clock;
		this.syncGamesFlow = syncGamesFlow;
		this.syncCompletionStatusesFlow = syncCompletionStatusesFlow;
	}

	executeAsync: IGameLibrarySyncManagerPort["executeAsync"] = async () => {
		await Promise.all([
			this.syncGamesFlow.executeAsync(),
			this.syncCompletionStatusesFlow.executeAsync(),
		]);
	};
}
