import type { IAsyncQueryHandlerPort } from "$lib/modules/common/common";
import type {
	GetGameLibraryFiltersQuery,
	GetGameLibraryFiltersQueryResult,
} from "./get-game-library-filters.query";

export type IGetGameLibraryFiltersQueryHandlerPort = IAsyncQueryHandlerPort<
	GetGameLibraryFiltersQuery,
	GetGameLibraryFiltersQueryResult
>;
