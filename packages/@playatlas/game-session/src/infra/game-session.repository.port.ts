import type { GameSessionId } from "@playatlas/common/domain";
import type { IEntityRepositoryPort } from "@playatlas/common/infra";
import type { GameSession } from "../domain/game-session.entity";
import type { GameSessionRepositoryFilters } from "./game-session.repository.filters";

export type IGameSessionRepositoryPort = IEntityRepositoryPort<
	GameSessionId,
	GameSession,
	GameSessionRepositoryFilters
>;
