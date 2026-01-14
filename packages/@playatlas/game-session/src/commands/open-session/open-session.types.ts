import type { IDomainEventBusPort, ILogServicePort } from "@playatlas/common/application";
import type { IGameSessionRepositoryPort } from "../../infra";
import type { GameInfoProvider } from "../../types/game-info-provider";

export type OpenGameSessionServiceDeps = {
	gameSessionRepository: IGameSessionRepositoryPort;
	gameInfoProvider: GameInfoProvider;
	logService: ILogServicePort;
	eventBus: IDomainEventBusPort;
};

export type OpenGameSessionCommandResult =
	| {
			success: false;
			reason: string;
			reason_code: "game_not_found";
	  }
	| {
			success: true;
			reason: string;
			reason_code: "opened_game_session_created";
	  };
