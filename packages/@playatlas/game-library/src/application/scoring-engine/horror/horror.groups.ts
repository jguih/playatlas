export const horrorEvidenceGroups = [
	"core_horror",
	"survival_horror",
	"psychological_horror",
	"cosmic_horror",
	"atmospheric_horror",
	"synergy",
] as const satisfies string[];

export type HorrorEvidenceGroup = (typeof horrorEvidenceGroups)[number];
