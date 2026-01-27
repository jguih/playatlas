export type SyncStatus = "pending" | "synced" | "error";

export type EntitySyncStateProps = {
	Status: SyncStatus;
	ErrorMessage: string | null;
	LastSyncedAt: Date;
};
