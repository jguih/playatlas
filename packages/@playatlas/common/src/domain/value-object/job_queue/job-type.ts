export const jobTypes = ["game-library-sync", "media-files-sync"] as const satisfies string[];

export type JobType = (typeof jobTypes)[number];
