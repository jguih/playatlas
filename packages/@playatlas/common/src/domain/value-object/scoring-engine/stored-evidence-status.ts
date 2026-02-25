export const storedEvidenceStatus = ["used", "ignored"] as const satisfies string[];

export type StoredEvidenceStatus = (typeof storedEvidenceStatus)[number];
