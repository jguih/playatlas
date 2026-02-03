import type { GetGamesQuery } from "$lib/modules/common/queries";

export type CreateGameLibraryFilterCommand = {
	query: GetGamesQuery;
};

export type CreateGameLibraryFilterCommandResult = void;
