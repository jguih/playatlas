import { GAME_IMAGE_TYPE } from "./game-assets.constants";
import type { GameImageType } from "./game.types";

export const isValidFileName = (value?: string): value is GameImageType => {
	return GAME_IMAGE_TYPE.includes(value as GameImageType);
};
