import type { Game } from '../../domain/game.entity';

export type SyncGamesCommand = {
	games: Game[] | Game;
};
