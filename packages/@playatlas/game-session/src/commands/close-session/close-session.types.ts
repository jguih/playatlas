import type { IDomainEventBusPort, ILogServicePort } from "@playatlas/common/application";
import type { IGameSessionRepositoryPort } from "../../infra";
import type { GameInfoProvider } from "../../types";

export type CloseGameSessionServiceDeps = {
	gameSessionRepository: IGameSessionRepositoryPort;
	logService: ILogServicePort;
	gameInfoProvider: GameInfoProvider;
	eventBus: IDomainEventBusPort;
};

export type CloseGameSessionCommandResult =
	| {
			success: false;
			reason: string;
			reason_code: "game_not_found";
	  }
	| {
			success: true;
			reason: string;
			reason_code:
				| "closed_game_session_created"
				| "closed_in_progress_game_session"
				| "game_session_is_already_closed";
	  };
