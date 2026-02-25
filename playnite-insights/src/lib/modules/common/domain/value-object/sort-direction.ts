export const sortDirection = ["asc", "desc"] as const satisfies string[];

export type SortDirection = (typeof sortDirection)[number];
