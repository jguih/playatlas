import type { IDomainEventBusPort, ILogServicePort } from "@playatlas/common/application";
import type { IClockPort } from "@playatlas/common/infra";
import type { IGameSessionRepositoryPort } from "../../infra";
import type { GameInfoProvider } from "../../types";

export type StaleGameSessionServiceDeps = {
	gameSessionRepository: IGameSessionRepositoryPort;
	logService: ILogServicePort;
	gameInfoProvider: GameInfoProvider;
	eventBus: IDomainEventBusPort;
	clock: IClockPort;
};

export type StaleGameSessionCommandResult =
	| {
			success: false;
			reason: string;
			reason_code: "game_not_found" | "cannot_stale_closed_game_session";
	  }
	| {
			success: true;
			reason: string;
			reason_code:
				| "stale_game_session_created"
				| "staled_in_progress_game_session"
				| "game_session_is_already_stale";
	  };
