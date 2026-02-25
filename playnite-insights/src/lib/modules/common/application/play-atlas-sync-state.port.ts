import type { SyncTarget } from "../domain";

export interface IPlayAtlasSyncStatePort {
	getLastServerSyncCursor(target: SyncTarget): string | null;
	setLastServerSyncCursor(target: SyncTarget, cursor: string): void;
}
