export type SyncTarget =
	| "completionStatuses"
	| "games"
	| "companies"
	| "genres"
	| "platforms"
	| "gameClassifications"
	| "gameSessions";

export interface IGameLibrarySyncStatePort {
	getLastServerSyncCursor(target: SyncTarget): string | null;
	setLastServerSyncCursor(target: SyncTarget, cursor: string): void;
}
