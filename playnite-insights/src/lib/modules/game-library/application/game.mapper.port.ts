import type { IClientEntityMapper } from "$lib/modules/common/common";
import type { PlayniteProjectionResponseDto } from "@playatlas/game-library/dtos";
import type { Game, GameId } from "../domain/game.entity";
import type { GameModel } from "../infra/game.repository";

export type IGameMapperPort = IClientEntityMapper<GameId, Game, GameModel> & {
	fromDto: (dto: PlayniteProjectionResponseDto, lastSync?: Date | null) => Game;
};
