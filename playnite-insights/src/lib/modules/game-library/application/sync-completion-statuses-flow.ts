import type { IClockPort } from "$lib/modules/common/application";
import type { ISyncCompletionStatusesCommandHandlerPort } from "../commands";
import type { ICompletionStatusMapperPort } from "./completion-status.mapper.port";
import type { IGameLibrarySyncStatePort } from "./game-library-sync-state.port";
import type { IPlayAtlasClientPort } from "./playatlas-client.port";
import type { ISyncCompletionStatusesFlowPort } from "./sync-completion-statuses-flow.port";

export type SyncCompletionStatusesFlowDeps = {
	gameLibrarySyncState: IGameLibrarySyncStatePort;
	playAtlasClient: IPlayAtlasClientPort;
	syncCompletionStatusesCommandHandler: ISyncCompletionStatusesCommandHandlerPort;
	completionStatusMapper: ICompletionStatusMapperPort;
	clock: IClockPort;
};

export class SyncCompletionStatusesFlow implements ISyncCompletionStatusesFlowPort {
	private readonly gameLibrarySyncState: IGameLibrarySyncStatePort;
	private readonly playAtlasClient: IPlayAtlasClientPort;
	private readonly syncCompletionStatusesCommandHandler: ISyncCompletionStatusesCommandHandlerPort;
	private readonly completionStatusMapper: ICompletionStatusMapperPort;
	private readonly clock: IClockPort;

	constructor({
		gameLibrarySyncState,
		completionStatusMapper,
		playAtlasClient,
		syncCompletionStatusesCommandHandler,
		clock,
	}: SyncCompletionStatusesFlowDeps) {
		this.gameLibrarySyncState = gameLibrarySyncState;
		this.playAtlasClient = playAtlasClient;
		this.syncCompletionStatusesCommandHandler = syncCompletionStatusesCommandHandler;
		this.completionStatusMapper = completionStatusMapper;
		this.clock = clock;
	}

	executeAsync: ISyncCompletionStatusesFlowPort["executeAsync"] = async () => {
		const now = this.clock.now();
		const lastCursor = this.gameLibrarySyncState.getLastServerSyncCursor("completionStatuses");

		const response = await this.playAtlasClient.getCompletionStatusesAsync({
			lastCursor,
		});

		if (!response.success) return;

		const completionStatuses = response.completionStatuses.map((g) =>
			this.completionStatusMapper.toDomain(g, now),
		);

		await this.syncCompletionStatusesCommandHandler.executeAsync({ completionStatuses });

		this.gameLibrarySyncState.setLastServerSyncCursor("completionStatuses", response.nextCursor);
	};
}
