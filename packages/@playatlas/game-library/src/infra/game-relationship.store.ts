import type { GameId } from "@playatlas/common/domain";
import { runSavePoint, type DbGetter } from "@playatlas/common/infra";
import type { GameRelationshipMap } from "../domain/game.entity.types";
import type { IGameRelationshipStorePort } from "./game-relationship.store.port";
import { GAME_RELATIONSHIP_META } from "./game.repository.constants";

export type GameRelationshipStoreDeps = {
	getDb: DbGetter;
};

export const makeGameRelationshipStore = ({
	getDb,
}: GameRelationshipStoreDeps): IGameRelationshipStorePort => {
	const replaceForGame: IGameRelationshipStorePort["replaceForGame"] = ({
		gameId,
		relationship,
		newRelationshipIds,
	}) => {
		const { table, column } = GAME_RELATIONSHIP_META[relationship];

		return runSavePoint({
			getDb,
			fn: ({ db }) => {
				db.prepare(`DELETE FROM ${table} WHERE GameId = ?`).run(gameId);
				if (newRelationshipIds.length > 0) {
					const stmt = db.prepare(`INSERT INTO ${table} (GameId, ${column}) VALUES (?, ?)`);
					for (const id of newRelationshipIds) {
						stmt.run(gameId, id);
					}
				}
			},
		});
	};

	const loadForGames: IGameRelationshipStorePort["loadForGames"] = ({ relationship, gameIds }) => {
		const { table, column } = GAME_RELATIONSHIP_META[relationship];
		const db = getDb();
		const placeholders = gameIds.map(() => "?").join(",");

		const stmt = db.prepare(`
        SELECT GameId, ${column}
        FROM ${table}
        WHERE GameId IN (${placeholders})
      `);
		const rows = stmt.all(...gameIds);

		const map = new Map<GameId, GameRelationshipMap[typeof relationship][]>();

		for (const gameId of gameIds) {
			map.set(gameId, []);
		}

		for (const props of rows) {
			const gameId = props.GameId as GameId;
			const entityId = props[column] as GameRelationshipMap[typeof relationship];
			map.get(gameId)!.push(entityId);
		}

		return map;
	};

	return {
		loadForGames,
		replaceForGame,
	};
};
