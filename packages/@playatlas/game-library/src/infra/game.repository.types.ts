import type { GameId } from "@playatlas/common/domain";
import type { SyncCursor } from "@playatlas/common/infra";
import type { GameRelationship, GameRelationshipMap } from "../domain/game.entity.types";

export type GetRelationshipsForFn = {
	<R extends GameRelationship>(props: {
		relationship: R;
		gameIds: GameId[];
	}): Map<GameId, GameRelationshipMap[R][]>;
};

export type UpdateRelationshipsForFn = {
	<R extends GameRelationship>(props: {
		relationship: R;
		gameId: GameId;
		newRelationshipIds: GameRelationshipMap[R][];
	}): void;
};

export type GameFilters = {
	hidden?: boolean;
	syncCursor?: SyncCursor | null;
};
