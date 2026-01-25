import type { IClockPort } from "$lib/modules/common/application";
import type { ISyncCompletionStatusesCommandHandlerPort } from "../commands";
import type { ICompletionStatusMapperPort } from "./completion-status.mapper.port";
import type { IGameLibrarySyncStatePort } from "./game-library-sync-state.port";
import type { IPlayAtlasClientPort } from "./playatlas-client.port";
import type { ISyncCompletionStatusesFlowPort } from "./sync-completion-statuses-flow.port";

export type SyncCompletionStatusesFlowDeps = {
	clock: IClockPort;
	gameLibrarySyncState: IGameLibrarySyncStatePort;
	playAtlasClient: IPlayAtlasClientPort;
	syncCompletionStatusesCommandHandler: ISyncCompletionStatusesCommandHandlerPort;
	completionStatusMapper: ICompletionStatusMapperPort;
};

export class SyncCompletionStatusesFlow implements ISyncCompletionStatusesFlowPort {
	private readonly clock: IClockPort;
	private readonly gameLibrarySyncState: IGameLibrarySyncStatePort;
	private readonly playAtlasClient: IPlayAtlasClientPort;
	private readonly syncCompletionStatusesCommandHandler: ISyncCompletionStatusesCommandHandlerPort;
	private readonly completionStatusMapper: ICompletionStatusMapperPort;

	constructor({
		clock,
		gameLibrarySyncState,
		completionStatusMapper,
		playAtlasClient,
		syncCompletionStatusesCommandHandler,
	}: SyncCompletionStatusesFlowDeps) {
		this.clock = clock;
		this.gameLibrarySyncState = gameLibrarySyncState;
		this.playAtlasClient = playAtlasClient;
		this.syncCompletionStatusesCommandHandler = syncCompletionStatusesCommandHandler;
		this.completionStatusMapper = completionStatusMapper;
	}

	executeAsync: ISyncCompletionStatusesFlowPort["executeAsync"] = async () => {
		const lastSync = this.gameLibrarySyncState.getLastServerSync("completionStatuses");

		const response = await this.playAtlasClient.getCompletionStatusesAsync({
			sinceLastSync: lastSync,
		});

		if (!response.success) return;

		const completionStatuses = response.completionStatuses.map((g) =>
			this.completionStatusMapper.toDomain(g, lastSync),
		);

		await this.syncCompletionStatusesCommandHandler.executeAsync({ completionStatuses });

		this.gameLibrarySyncState.setLastServerSync(
			"completionStatuses",
			new Date(response.nextCursor),
		);
	};
}
