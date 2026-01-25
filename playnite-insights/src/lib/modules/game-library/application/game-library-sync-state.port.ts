export type SyncTarget = "completionStatuses" | "games";

export interface IGameLibrarySyncStatePort {
	getLastServerSync(target: SyncTarget): Date;
	setLastServerSync(target: SyncTarget, date: Date): void;
}
