import {
  ICloseGameSessionCommandHandlerPort,
  IOpenGameSessionCommandHandlerPort,
  IStaleGameSessionCommandHandlerPort,
} from "@playatlas/game-session/commands";
import { IGameSessionRepositoryPort } from "@playatlas/game-session/infra";

export type IGameSessionModulePort = {
  getGameSessionRepository: () => IGameSessionRepositoryPort;
  commands: {
    getOpenGameSessionCommandHandler: () => IOpenGameSessionCommandHandlerPort;
    getCloseGameSessionCommandHandler: () => ICloseGameSessionCommandHandlerPort;
    getStaleGameSessionCommandHandler: () => IStaleGameSessionCommandHandlerPort;
  };
};
