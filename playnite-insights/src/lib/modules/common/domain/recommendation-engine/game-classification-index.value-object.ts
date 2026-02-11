import type { ClassificationId } from "@playatlas/common/domain";

export const GAME_CLASSIFICATION_INDEX = {
	HORROR: 0,
	SURVIVAL: 1,
	RPG: 2,
} as const satisfies Record<ClassificationId, number>;

export const GAME_CLASSIFICATION_DIMENSIONS = Object.keys(GAME_CLASSIFICATION_INDEX).length;
