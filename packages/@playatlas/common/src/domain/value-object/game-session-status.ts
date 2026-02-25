export const gameSessionStatus = ["in_progress", "closed", "stale"] as const satisfies string[];

export type GameSessionStatus = (typeof gameSessionStatus)[number];
