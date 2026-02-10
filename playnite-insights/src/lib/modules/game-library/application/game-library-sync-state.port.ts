export type SyncTarget =
	| "completionStatuses"
	| "games"
	| "companies"
	| "genres"
	| "platforms"
	| "gameClassifications";

export interface IGameLibrarySyncStatePort {
	getLastServerSyncCursor(target: SyncTarget): string | null;
	setLastServerSyncCursor(target: SyncTarget, cursor: string): void;
}
