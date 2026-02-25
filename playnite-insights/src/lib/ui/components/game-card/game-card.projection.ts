import type { GameId } from "$lib/modules/common/domain";

export type GameCardProjection = {
	id: GameId;
	name: string;
	coverImageFilePath?: string | null;
};

export type GameCardProps = {
	game: GameCardProjection;
	hideName?: boolean;
};
