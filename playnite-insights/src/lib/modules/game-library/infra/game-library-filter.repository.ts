import { ClientEntityRepository, type ClientEntityRepositoryDeps } from "$lib/modules/common/infra";
import type { GetGamesQuerySort } from "$lib/modules/common/queries";
import type { IGameLibraryFilterMapperPort } from "../application/game-library-filter.mapper.port";
import type {
	GameLibraryFilter,
	GameLibraryFilterId,
	StoredGameLibraryFilter,
} from "../domain/game-library-filter";
import type { IGameLibraryFilterRepositoryPort } from "./game-library-filter.repository.port";
import { gameLibraryFilterRepositoryMeta } from "./game-library-filter.repository.schema";

export type GameLibraryFilterModel = {
	Id: GameLibraryFilterId;
	SourceUpdatedAt: Date;
	SourceUpdatedAtMs: number;
	Query: {
		Sort: GetGamesQuerySort;
		Filter?: StoredGameLibraryFilter | null;
	};
	QueryVersion: number;
	Key: string;
	LastUsedAt: Date;
	LastUsedAtMs: number;
	UseCount: number;
};

export type GameLibraryFilterRepositoryDeps = ClientEntityRepositoryDeps & {
	gameLibraryFilterMapper: IGameLibraryFilterMapperPort;
};

export class GameLibraryFilterRepository
	extends ClientEntityRepository<GameLibraryFilterId, GameLibraryFilter, GameLibraryFilterModel>
	implements IGameLibraryFilterRepositoryPort
{
	constructor(deps: GameLibraryFilterRepositoryDeps) {
		super({
			dbSignal: deps.dbSignal,
			storeName: gameLibraryFilterRepositoryMeta.storeName,
			mapper: deps.gameLibraryFilterMapper,
		});
	}

	getByLastUsedAtDescAsync: IGameLibraryFilterRepositoryPort["getByLastUsedAtDescAsync"] =
		async () => {
			return await this.runTransaction([this.storeName], "readonly", async ({ tx }) => {
				const store = tx.objectStore(this.storeName);
				const idx = store.index(gameLibraryFilterRepositoryMeta.index.byLastUsedAt);
				const items: GameLibraryFilter[] = [];

				return await new Promise<GameLibraryFilter[]>((resolve, reject) => {
					const request = idx.openCursor(null, "prev");

					request.onerror = () => reject(request.error);

					request.onsuccess = () => {
						const cursor = request.result;

						if (!cursor) {
							resolve(items);
							return;
						}

						const gameLibraryFilter: GameLibraryFilterModel = cursor.value;
						items.push(this.mapper.toDomain(gameLibraryFilter));

						cursor.continue();
					};
				});
			});
		};
}
