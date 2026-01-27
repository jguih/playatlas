import type {
	IGameLibrarySyncStatePort,
	SyncTarget,
} from "../application/game-library-sync-state.port";

const LAST_SERVER_SYNC_KEY_PREFIX = "playatlas.gameLibrary.lastServerSync";

export class GameLibrarySyncState implements IGameLibrarySyncStatePort {
	private getKey = (target: SyncTarget) => {
		return `${LAST_SERVER_SYNC_KEY_PREFIX}.${target}`;
	};

	getLastServerSyncCursor: IGameLibrarySyncStatePort["getLastServerSyncCursor"] = (target) => {
		return localStorage.getItem(this.getKey(target));
	};

	setLastServerSyncCursor: IGameLibrarySyncStatePort["setLastServerSyncCursor"] = (
		target,
		cursor,
	) => {
		localStorage.setItem(this.getKey(target), cursor);
	};
}
