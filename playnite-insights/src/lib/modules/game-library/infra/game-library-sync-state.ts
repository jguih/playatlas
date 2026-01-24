import type { IGameLibrarySyncStatePort } from "../application/game-library-sync-state.port";

const LAST_SERVER_SYNC_KEY = "playatlas.gameLibrary.lastServerSync";

export class GameLibrarySyncState implements IGameLibrarySyncStatePort {
	getLastServerSync(): Date | null {
		const raw = localStorage.getItem(LAST_SERVER_SYNC_KEY);

		if (!raw) return null;

		const date = new Date(raw);

		return Number.isNaN(date.getTime()) ? null : date;
	}

	setLastServerSync(date: Date): void {
		localStorage.setItem(LAST_SERVER_SYNC_KEY, date.toISOString());
	}
}
