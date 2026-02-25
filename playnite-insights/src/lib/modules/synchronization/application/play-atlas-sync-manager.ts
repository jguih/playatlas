import type { IClockPort, IDomainEventBusPort } from "$lib/modules/common/application";
import type { SyncTarget } from "$lib/modules/common/domain";
import type {
	ISyncCompaniesFlowPort,
	ISyncCompletionStatusesFlowPort,
	ISyncGameClassificationsFlowPort,
	ISyncGamesFlowPort,
	ISyncGenresFlowPort,
	ISyncPlatformsFlowPort,
} from "$lib/modules/game-library/application";
import type { ISyncGameSessionsFlowPort } from "$lib/modules/game-session/application";
import type { IPlayAtlasSyncManagerPort } from "./play-atlas-sync-manager.port";
import type { ISyncProgressReporterPort } from "./sync-progress-reporter.svelte";

export type PlayAtlasSyncManagerDeps = {
	syncGamesFlow: ISyncGamesFlowPort;
	syncCompletionStatusesFlow: ISyncCompletionStatusesFlowPort;
	syncCompaniesFlow: ISyncCompaniesFlowPort;
	syncGenresFlow: ISyncGenresFlowPort;
	syncPlatformsFlow: ISyncPlatformsFlowPort;
	syncGameClassificationsFlow: ISyncGameClassificationsFlowPort;
	syncGameSessionsFlow: ISyncGameSessionsFlowPort;
	progressReporter: ISyncProgressReporterPort;
	clock: IClockPort;
	eventBus: IDomainEventBusPort;
};

export class PlayAtlasSyncManager implements IPlayAtlasSyncManagerPort {
	private readonly MIN_VISIBLE_MS = 300;
	private syncing = false;

	constructor(private readonly deps: PlayAtlasSyncManagerDeps) {}

	executeAsync: IPlayAtlasSyncManagerPort["executeAsync"] = async () => {
		if (this.syncing) return;
		this.syncing = true;

		const { progressReporter, clock, eventBus } = this.deps;

		const startedAt = clock.now().getTime();
		progressReporter.report({ type: "sync-started" });

		try {
			const flows: Array<{ key: SyncTarget; run: () => Promise<void> }> = [
				{ key: "games", run: this.deps.syncGamesFlow.executeAsync },
				{ key: "completionStatuses", run: this.deps.syncCompletionStatusesFlow.executeAsync },
				{ key: "companies", run: this.deps.syncCompaniesFlow.executeAsync },
				{ key: "genres", run: this.deps.syncGenresFlow.executeAsync },
				{ key: "platforms", run: this.deps.syncPlatformsFlow.executeAsync },
				{ key: "gameClassifications", run: this.deps.syncGameClassificationsFlow.executeAsync },
				{ key: "gameSessions", run: this.deps.syncGameSessionsFlow.executeAsync },
			];

			for (const { key, run } of flows) {
				progressReporter.report({ type: "flow-started", flow: key });
				try {
					await run();
				} finally {
					progressReporter.report({ type: "flow-finished", flow: key });
				}
			}
		} finally {
			const elapsed = clock.now().getTime() - startedAt;
			const remaining = Math.max(0, this.MIN_VISIBLE_MS - elapsed);

			setTimeout(() => {
				progressReporter.report({ type: "sync-finished" });

				eventBus.emit({
					id: crypto.randomUUID(),
					name: "sync-finished",
					occurredAt: this.deps.clock.now(),
				});
			}, remaining);

			this.syncing = false;
		}
	};
}
