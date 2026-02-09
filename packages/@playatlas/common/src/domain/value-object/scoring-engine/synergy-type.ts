export const synergyType = ["multiple_sources"] as const satisfies string[];

export type SynergyType = (typeof synergyType)[number];
