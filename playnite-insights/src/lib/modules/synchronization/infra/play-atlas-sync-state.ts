import type { IPlayAtlasSyncStatePort } from "$lib/modules/common/application";
import type { SyncTarget } from "$lib/modules/common/domain";

const LAST_SERVER_SYNC_KEY_PREFIX = "playatlas.lastServerSync";

export class PlayAtlasSyncState implements IPlayAtlasSyncStatePort {
	private getKey = (target: SyncTarget) => {
		return `${LAST_SERVER_SYNC_KEY_PREFIX}.${target}`;
	};

	getLastServerSyncCursor: IPlayAtlasSyncStatePort["getLastServerSyncCursor"] = (target) => {
		return localStorage.getItem(this.getKey(target));
	};

	setLastServerSyncCursor: IPlayAtlasSyncStatePort["setLastServerSyncCursor"] = (
		target,
		cursor,
	) => {
		localStorage.setItem(this.getKey(target), cursor);
	};
}
