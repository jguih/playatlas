import type { GameId, PlayniteGameId } from "@playatlas/common/domain";
import type { IEntityRepositoryPort } from "@playatlas/common/infra";
import type { Game, GameRelationship } from "../domain/game.entity";
import type { GameManifestData } from "./game.repository";
import type { GameFilters } from "./game.repository.types";

export type GameRepositoryEagerLoadProps = {
	load?: Partial<Record<GameRelationship, boolean>> | boolean;
};

export type IGameRepositoryPort = Omit<
	IEntityRepositoryPort<GameId, Game>,
	"all" | "getById" | "add" | "update"
> & {
	getById: (id: GameId, props?: GameRepositoryEagerLoadProps) => Game | null;
	getByPlayniteId: (id: PlayniteGameId, props?: GameRepositoryEagerLoadProps) => Game | null;
	getManifestData: () => GameManifestData;
	getTotal: (filters?: GameFilters) => number;
	getTotalPlaytimeSeconds: (filters?: GameFilters) => number;
	all: (props?: GameRepositoryEagerLoadProps, filters?: GameFilters) => Game[];
};
