import { ClientEntityRepository, type ClientEntityRepositoryDeps } from "$lib/modules/common/infra";
import type { IGameMapperPort } from "../application/game.mapper.port";
import type { Game, GameId } from "../domain/game.entity";
import type { IGameRepositoryPort } from "./game.repository.port";
import { gameRepositoryMeta } from "./game.repository.schema";
import type { GameQueryResult } from "./game.repository.types";

export type GameRepositoryDeps = ClientEntityRepositoryDeps & {
	gameMapper: IGameMapperPort;
};

export type GameModel = {
	Id: GameId;
	SourceUpdatedAt: Date;
	SourceUpdatedAtMs: number;
	SourceDeletedAt?: Date | null;
	SourceDeleteAfter?: Date | null;
	Name: string | null;
	Description: string | null;
	ReleaseDate: Date | null;
	Playtime: number;
	LastActivity: Date | null;
	Added: Date | null;
	InstallDirectory: string | null;
	IsInstalled: boolean;
	BackgroundImagePath: string | null;
	CoverImagePath: string | null;
	IconImagePath: string | null;
	Hidden: boolean;
	CompletionStatusId: string | null;
	ContentHash: string;
	Developers: string[];
	Publishers: string[];
	Genres: string[];
	Platforms: string[];

	Sync: {
		Status: "pending" | "synced" | "error";
		ErrorMessage?: string | null;
		LastSyncedAt: Date;
	};
};

export class GameRepository
	extends ClientEntityRepository<GameId, Game, GameModel>
	implements IGameRepositoryPort
{
	constructor({ dbSignal, gameMapper }: GameRepositoryDeps) {
		super({ dbSignal, storeName: gameRepositoryMeta.storeName, mapper: gameMapper });
	}

	queryAsync: IGameRepositoryPort["queryAsync"] = async ({ index, direction, range, limit }) => {
		return await this.runTransaction([this.storeName], "readonly", async ({ tx }) => {
			const store = tx.objectStore(this.storeName);
			const idx = store.index(index);

			const items: Game[] = [];
			const keys: Map<GameId, IDBValidKey> = new Map();
			let lastKey: IDBValidKey | null = null;

			return await new Promise<GameQueryResult>((resolve, reject) => {
				const request = idx.openCursor(range, direction);

				request.onerror = () => reject(request.error);

				request.onsuccess = () => {
					const cursor = request.result;

					if (!cursor) {
						resolve({ items, keys, nextKey: lastKey });
						return;
					}

					const game: Game = cursor.value;
					items.push(game);
					keys.set(game.Id, cursor.key);
					lastKey = cursor.key;

					if (items.length === limit) {
						resolve({ items, keys, nextKey: lastKey });
						return;
					}

					cursor.continue();
				};
			});
		});
	};
}
