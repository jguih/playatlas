export type BaseEntitySoftDeleteProps = {
	deletedAt: Date | null;
	deleteAfter: Date | null;
};

export type BaseEntitySyncProps = {
	lastUpdatedAt: Date;
	createdAt: Date;
};
