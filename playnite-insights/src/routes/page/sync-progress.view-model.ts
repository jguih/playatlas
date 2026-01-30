import type { SyncFlowKey } from "$lib/modules/game-library/application";
import { m } from "$lib/paraglide/messages";

export class SyncProgressViewModel {
	constructor() {}

	static getSyncProgressLabel = (activeFlow: SyncFlowKey | null) => {
		switch (activeFlow) {
			case "games":
				return m["progress.syncing_games"]();
			case "completion-statuses":
				return m["progress.syncing_completion_statuses"]();
			case "companies":
				return m["progress.syncing_companies"]();
			case "genres":
				return m["progress.syncing_genres"]();
			default:
				return m["progress.syncing_library"]();
		}
	};
}
