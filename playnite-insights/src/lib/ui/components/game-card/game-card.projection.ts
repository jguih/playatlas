import type { GameId } from "$lib/modules/game-library/domain";

export type GameCardProjection = {
	id: GameId;
	name: string;
	coverImageFilePath: string;
};

export type GameCardProps = {
	game: GameCardProjection;
};
