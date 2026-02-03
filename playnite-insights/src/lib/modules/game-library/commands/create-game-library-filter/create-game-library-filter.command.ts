import type { GameLibraryFilterQuery } from "../../domain/game-library-filter";

export type CreateGameLibraryFilterCommand = {
	query: GameLibraryFilterQuery;
};

export type CreateGameLibraryFilterCommandResult = void;
