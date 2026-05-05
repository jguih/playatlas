export const jobStatuses = ["queued", "processing", "done", "failed"] as const satisfies string[];

export type JobStatus = (typeof jobStatuses)[number];

export const JobStatus = Object.fromEntries(jobStatuses.map((s) => [s, s])) as Record<
	JobStatus,
	JobStatus
>;
