import type { GameImageType } from "./game.types";

export const GAME_IMAGE_TYPE = ["background", "icon", "cover"] as const;

export const GAME_MEDIA_PRESETS: Record<GameImageType, { w: number; h: number; q: number }> = {
	background: { w: 1920, h: 1080, q: 80 },
	cover: { w: 600, h: 900, q: 82 },
	icon: { w: 256, h: 256, q: 90 },
} as const;

export const CONTENT_HASH_FILE_NAME = "contentHash.txt" as const;
