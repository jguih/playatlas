export const syncTarget = [
	"completionStatuses",
	"games",
	"companies",
	"genres",
	"platforms",
	"gameClassifications",
	"gameSessions",
] as const satisfies string[];

export type SyncTarget = (typeof syncTarget)[number];
