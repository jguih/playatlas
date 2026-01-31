import type { IClientEntityMapper } from "$lib/modules/common/common";
import type { GameLibraryFilter, GameLibraryFilterId } from "../domain/game-library-filter";
import type { GameLibraryFilterModel } from "../infra/game-library-filter.repository";

export type IGameLibraryFilterMapperPort = IClientEntityMapper<
	GameLibraryFilterId,
	GameLibraryFilter,
	GameLibraryFilterModel
>;
