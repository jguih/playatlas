export type SyncTarget = "completionStatuses" | "games" | "companies";

export interface IGameLibrarySyncStatePort {
	getLastServerSyncCursor(target: SyncTarget): string | null;
	setLastServerSyncCursor(target: SyncTarget, cursor: string): void;
}
