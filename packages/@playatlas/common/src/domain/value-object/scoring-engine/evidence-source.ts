export const evidenceSource = [
	"taxonomy",
	"text",
	"mechanics",
	"synergy",
] as const satisfies string[];

export type EvidenceSource = (typeof evidenceSource)[number];
