import type { IClockPort, IDomainEventBusPort } from "$lib/modules/common/application";
import type { IGameLibrarySyncManagerPort } from "./game-library-sync-manager.port";
import type { ISyncCompaniesFlowPort } from "./sync-companies-flow";
import type { ISyncCompletionStatusesFlowPort } from "./sync-completion-statuses-flow";
import type { ISyncGameClassificationsFlowPort } from "./sync-game-classifications-flow";
import type { ISyncGamesFlowPort } from "./sync-games-flow";
import type { ISyncGenresFlowPort } from "./sync-genres-flow";
import type { ISyncPlatformsFlowPort } from "./sync-platforms-flow";
import type { ISyncProgressReporterPort, SyncFlowKey } from "./sync-progress-reporter.svelte";

export type GameLibrarySyncManagerDeps = {
	syncGamesFlow: ISyncGamesFlowPort;
	syncCompletionStatusesFlow: ISyncCompletionStatusesFlowPort;
	syncCompaniesFlow: ISyncCompaniesFlowPort;
	syncGenresFlow: ISyncGenresFlowPort;
	syncPlatformsFlow: ISyncPlatformsFlowPort;
	syncGameClassificationsFlow: ISyncGameClassificationsFlowPort;
	progressReporter: ISyncProgressReporterPort;
	clock: IClockPort;
	eventBus: IDomainEventBusPort;
};

export class GameLibrarySyncManager implements IGameLibrarySyncManagerPort {
	private readonly MIN_VISIBLE_MS = 300;
	private syncing = false;

	constructor(private readonly deps: GameLibrarySyncManagerDeps) {}

	executeAsync: IGameLibrarySyncManagerPort["executeAsync"] = async () => {
		if (this.syncing) return;
		this.syncing = true;

		const { progressReporter, clock, eventBus } = this.deps;

		const startedAt = clock.now().getTime();
		progressReporter.report({ type: "sync-started" });

		try {
			const flows: Array<{ key: SyncFlowKey; run: () => Promise<void> }> = [
				{ key: "games", run: this.deps.syncGamesFlow.executeAsync },
				{ key: "completion-statuses", run: this.deps.syncCompletionStatusesFlow.executeAsync },
				{ key: "companies", run: this.deps.syncCompaniesFlow.executeAsync },
				{ key: "genres", run: this.deps.syncGenresFlow.executeAsync },
				{ key: "platforms", run: this.deps.syncPlatformsFlow.executeAsync },
				{ key: "gameClassifications", run: this.deps.syncGameClassificationsFlow.executeAsync },
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
			}, remaining);

			eventBus.emit({
				id: crypto.randomUUID(),
				name: "sync-finished",
				occurredAt: this.deps.clock.now(),
			});

			this.syncing = false;
		}
	};
}
