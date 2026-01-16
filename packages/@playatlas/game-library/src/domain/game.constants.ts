import type { PlayniteProjectionResponseDto } from "../dtos/game.response.dto";

export const gameSortBy = [
	"LastActivity",
	"IsInstalled",
	"Added",
	"Playtime",
] satisfies (keyof PlayniteProjectionResponseDto)[];
export const gameSortOrder = ["desc", "asc"] as const;
export const gamePageSizes = [25, 50, 75, 100] as const;
