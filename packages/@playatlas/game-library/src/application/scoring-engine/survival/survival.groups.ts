export const survivalEvidenceGroups = ["core_survival"] as const satisfies string[];

export type SurvivalEvidenceGroup = (typeof survivalEvidenceGroups)[number];
