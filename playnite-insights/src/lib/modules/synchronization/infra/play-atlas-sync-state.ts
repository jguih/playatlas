import type { IPlayAtlasSyncStatePort } from "$lib/modules/common/application";
import type { SyncTarget } from "$lib/modules/common/domain";

const LAST_SERVER_SYNC_KEY_PREFIX = "playatlas.lastServerSync";

export class PlayAtlasSyncState implements IPlayAtlasSyncStatePort {
	private readonly cursorQueue: Map<SyncTarget, string> = new Map();

	constructor() {}

	private getKey = (target: SyncTarget) => {
		return `${LAST_SERVER_SYNC_KEY_PREFIX}.${target}`;
	};

	private drain = (): Map<SyncTarget, string> => {
		const pendingCursors = new Map(this.cursorQueue);
		this.cursorQueue.clear();
		return pendingCursors;
	};

	getSyncCursor: IPlayAtlasSyncStatePort["getSyncCursor"] = (target) => {
		return localStorage.getItem(this.getKey(target));
	};

	setSyncCursor: IPlayAtlasSyncStatePort["setSyncCursor"] = (target, cursor) => {
		localStorage.setItem(this.getKey(target), cursor);
	};

	enqueueSyncCursor: IPlayAtlasSyncStatePort["enqueueSyncCursor"] = (target, cursor) => {
		this.cursorQueue.set(target, cursor);
	};

	persistQueuedCursors: IPlayAtlasSyncStatePort["persistQueuedCursors"] = () => {
		const cursors = this.drain();

		for (const [target, cursor] of cursors) {
			this.setSyncCursor(target, cursor);
		}
	};
}
