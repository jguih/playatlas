export const jobStatuses = ["queued", "processing", "done", "failed"] as const satisfies string[];

export type JobStatus = (typeof jobStatuses)[number];
