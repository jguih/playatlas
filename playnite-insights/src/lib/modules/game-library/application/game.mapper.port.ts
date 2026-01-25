import type { PlayniteProjectionResponseDto } from "@playatlas/game-library/dtos";
import type { Game } from "../domain";

export type IGameMapperPort = {
	toDomain: (dto: PlayniteProjectionResponseDto, lastSync?: Date | null) => Game;
};
