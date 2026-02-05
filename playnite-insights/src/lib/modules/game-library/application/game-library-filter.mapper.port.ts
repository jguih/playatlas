import type { IClientEntityMapper } from "$lib/modules/common/common";
import type { GameLibraryFilter } from "../domain/game-library-filter";
import type { GameLibraryFilterId } from "../domain/value-object/game-library-filter-id";
import type { GameLibraryFilterModel } from "../infra/game-library-filter.repository";

export type IGameLibraryFilterMapperPort = IClientEntityMapper<
	GameLibraryFilterId,
	GameLibraryFilter,
	GameLibraryFilterModel
>;
