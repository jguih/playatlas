import type { SyncTarget } from "../domain";

export interface IPlayAtlasSyncStatePort {
	getSyncCursor: (target: SyncTarget) => string | null;
	setSyncCursor: (target: SyncTarget, cursor: string) => void;
	enqueueSyncCursor: (target: SyncTarget, cursor: string) => void;
	persistQueuedCursors: () => void;
}
