import { ClientEntityRepository, type ClientEntityRepositoryDeps } from "$lib/modules/common/infra";
import type { Game, GameId } from "../domain/game.entity";
import type { IGameRepositoryPort } from "./game.repository.port";
import { gameRepositoryMeta } from "./game.repository.schema";
import type { GameQueryResult } from "./game.repository.types";

export type GameRepositoryDeps = ClientEntityRepositoryDeps;

export class GameRepository
	extends ClientEntityRepository<Game, GameId>
	implements IGameRepositoryPort
{
	constructor({ dbSignal }: GameRepositoryDeps) {
		super({ dbSignal, storeName: gameRepositoryMeta.storeName });
	}

	queryAsync: IGameRepositoryPort["queryAsync"] = async ({
		index,
		direction = "prev",
		afterKey = null,
		limit,
	}) => {
		return await this.runTransaction([this.storeName], "readonly", async ({ tx }) => {
			const store = tx.objectStore(this.storeName);
			const idx = store.index(index);

			const items: Game[] = [];
			const keys: Map<GameId, IDBValidKey> = new Map();
			let lastKey: IDBValidKey | null = null;

			const range = afterKey ? IDBKeyRange.upperBound(afterKey, true) : null;

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
