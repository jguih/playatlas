import type {
	IGameLibrarySyncStatePort,
	SyncTarget,
} from "../application/game-library-sync-state.port";

const LAST_SERVER_SYNC_KEY_PREFIX = "playatlas.gameLibrary.lastServerSync";

export class GameLibrarySyncState implements IGameLibrarySyncStatePort {
	private getKey = (target: SyncTarget) => {
		return `${LAST_SERVER_SYNC_KEY_PREFIX}.${target}`;
	};

	getLastServerSync: IGameLibrarySyncStatePort["getLastServerSync"] = (target) => {
		const raw = localStorage.getItem(this.getKey(target));

		if (!raw) return new Date(0);

		const date = new Date(raw);

		return Number.isNaN(date.getTime()) ? new Date(0) : date;
	};

	setLastServerSync: IGameLibrarySyncStatePort["setLastServerSync"] = (target, date) => {
		localStorage.setItem(this.getKey(target), date.toISOString());
	};
}
