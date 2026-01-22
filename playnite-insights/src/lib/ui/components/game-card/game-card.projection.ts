import type { GameId } from "$lib/modules/game-library/domain";

export type GameCardProjection = {
	id: GameId;
	name: string;
	coverImageFileName: string;
};

export type GameCardProps = {
	game: GameCardProjection;
};
