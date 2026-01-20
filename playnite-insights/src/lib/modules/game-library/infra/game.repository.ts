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
			let nextKey: IDBValidKey | null = null;

			const range = afterKey ? IDBKeyRange.lowerBound(afterKey, true) : null;

			return await new Promise<GameQueryResult>((resolve, reject) => {
				const request = idx.openCursor(range, direction);

				request.onerror = () => reject(request.error);

				request.onsuccess = () => {
					const cursor = request.result;

					if (!cursor) {
						resolve({ items, nextKey: null });
						return;
					}

					const game: Game = cursor.value;

					if (!game.DeletedAt) {
						nextKey = cursor.key;
						items.push(cursor.value);
					}

					if (items.length === limit) {
						resolve({ items, nextKey });
						return;
					}

					cursor.continue();
				};
			});
		});
	};
}
