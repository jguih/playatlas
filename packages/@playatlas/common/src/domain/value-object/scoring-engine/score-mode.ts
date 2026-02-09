export const engineScoreMode = ["without_gate", "with_gate"] as const satisfies string[];

export type EngineScoreMode = (typeof engineScoreMode)[number];
