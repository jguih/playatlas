export const rpgEvidenceGroups = ["core_rpg"] as const satisfies string[];

export type RpgEvidenceGroup = (typeof rpgEvidenceGroups)[number];
