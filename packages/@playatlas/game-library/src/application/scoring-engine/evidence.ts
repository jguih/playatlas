import z from "zod";

export const evidenceSource = [
	"taxonomy",
	"text",
	"mechanics",
	"synergy",
] as const satisfies string[];

export type EvidenceSource = (typeof evidenceSource)[number];

export const evidenceTier = ["A", "B", "C"] as const satisfies string[];

export type EvidenceTier = (typeof evidenceTier)[number];

export type Evidence<TGroup> = {
	source: EvidenceSource;
	sourceHint?: string;
	match: string | number;
	weight: number;
	group: TGroup;
	tier: EvidenceTier;
	// Whether the signal is identity defining or not
	isGate: boolean;
};

export const evidenceSchema = z.object({
	source: z.enum(evidenceSource),
	sourceHint: z.string().nullable(),
	match: z.string().or(z.number()),
	weight: z.number(),
	group: z.string(),
	tier: z.enum(evidenceTier),
	isGate: z.boolean(),
});

export const storedEvidenceStatus = ["used", "ignored"] as const satisfies string[];

export type StoredEvidence<TGroup> = Evidence<TGroup> & {
	status: (typeof storedEvidenceStatus)[number];
	contribution: number;
};

export const storedEvidenceSchema = z.object({
	status: z.enum(storedEvidenceStatus),
	contribution: z.number(),
});
