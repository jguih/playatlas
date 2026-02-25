import type { GameLibraryFilter } from "../../domain/game-library-filter";

export type CreateGameLibraryFilterCommand = {
	query: GameLibraryFilter["Query"];
};

export type CreateGameLibraryFilterCommandResult = void;
