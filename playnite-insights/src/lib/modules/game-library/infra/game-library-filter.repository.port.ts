import type { IClientEntityRepository } from "$lib/modules/common/infra";
import type { GameLibraryFilter, GameLibraryFilterId } from "../domain/game-library-filter";

export type IGameLibraryFilterRepositoryPort = IClientEntityRepository<
	GameLibraryFilter,
	GameLibraryFilterId
> & {
	getByLastUsedAtDescAsync: () => Promise<GameLibraryFilter[]>;
};
