import type { GameId } from "@playatlas/common/domain";
import type { GameRelationship, GameRelationshipMap } from "../domain/game.entity.types";

type ReplaceRelationshipsForGameFn = {
	<R extends GameRelationship>(props: {
		relationship: R;
		gameId: GameId;
		newRelationshipIds: GameRelationshipMap[R][];
	}): void;
};

type LoadRelationshipsForGameFn = {
	<R extends GameRelationship>(props: {
		relationship: R;
		gameIds: GameId[];
	}): Map<GameId, GameRelationshipMap[R][]>;
};

export type IGameRelationshipStorePort = {
	replaceForGame: ReplaceRelationshipsForGameFn;
	loadForGames: LoadRelationshipsForGameFn;
};
