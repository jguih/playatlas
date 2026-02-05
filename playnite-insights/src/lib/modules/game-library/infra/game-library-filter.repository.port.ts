import type { IClientEntityRepository } from "$lib/modules/common/infra";
import type { GameLibraryFilterId } from "../domain";
import type { GameLibraryFilter } from "../domain/game-library-filter";

export type IGameLibraryFilterRepositoryPort = IClientEntityRepository<
	GameLibraryFilter,
	GameLibraryFilterId
> & {
	getByLastUsedAtDescAsync: () => Promise<GameLibraryFilter[]>;
};
