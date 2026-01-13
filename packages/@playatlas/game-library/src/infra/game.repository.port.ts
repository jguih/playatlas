import type { GameId } from "@playatlas/common/domain";
import type { IEntityRepositoryPort } from "@playatlas/common/infra";
import type { Game, GameRelationship } from "../domain/game.entity";
import type { GameFilters } from "../domain/game.types";
import type { GameManifestData } from "./game.repository";

export type GameRepositoryEagerLoadProps = {
  load?: Partial<Record<GameRelationship, boolean>> | boolean;
};

export type IGameRepositoryPort = Omit<
  IEntityRepositoryPort<GameId, Game>,
  "all" | "getById" | "add" | "update"
> & {
  getById: (id: string, props?: GameRepositoryEagerLoadProps) => Game | null;
  getManifestData: () => GameManifestData;
  getTotal: (filters?: GameFilters) => number;
  getTotalPlaytimeSeconds: (filters?: GameFilters) => number;
  all: (props?: GameRepositoryEagerLoadProps) => Game[];
};
