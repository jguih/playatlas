export type GameCardProjection = {
	name: string;
	coverImagePath: string;
	gamePagePath: string;
};

export type GameCardProps = {
	game: GameCardProjection;
};
