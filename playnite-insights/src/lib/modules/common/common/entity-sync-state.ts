export type EntitySyncStateProps = {
	Status: "pending" | "synced" | "error";
	ErrorMessage: string | null;
	LastSyncedAt: Date;
};
