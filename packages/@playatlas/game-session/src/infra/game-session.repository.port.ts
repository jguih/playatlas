import type { GameSession, GameSessionId } from "../domain/game-session.entity";
import type { GameSessionFilters } from "./game-session.repository";

export type IGameSessionRepositoryPort = {
  add: (newSession: GameSession) => void;
  update: (session: GameSession) => void;
  all: () => GameSession[];
  getById: (sessionId: GameSessionId) => GameSession | null;
  getAllBy: (params: { filters?: GameSessionFilters }) => GameSession[];
};
