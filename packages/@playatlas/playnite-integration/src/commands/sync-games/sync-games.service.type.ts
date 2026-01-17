import type { IDomainEventBusPort, ILogServicePort } from "@playatlas/common/application";
import type { IAsyncCommandHandlerPort } from "@playatlas/common/common";
import type { IClockPort } from "@playatlas/common/infra";
import type {
	ICompanyRepositoryPort,
	ICompletionStatusRepositoryPort,
	IGameRepositoryPort,
	IGenreRepositoryPort,
	IPlatformRepositoryPort,
} from "@playatlas/game-library/infra";
import type { ILibraryManifestServicePort } from "../../application";
import type { SyncGamesCommand } from "./sync-games.command";

export type SyncGamesCommandResult =
	| {
			success: true;
			reason: string;
			reason_code: "game_library_synchronized";
	  }
	| {
			success: false;
			reason: string;
			reason_code: "failed_to_parse_payload";
	  };

export type ISyncGamesCommandHandlerPort = IAsyncCommandHandlerPort<
	SyncGamesCommand,
	SyncGamesCommandResult
>;

export type SyncGamesServiceDeps = {
	logService: ILogServicePort;
	gameRepository: IGameRepositoryPort;
	genreRepository: IGenreRepositoryPort;
	platformRepository: IPlatformRepositoryPort;
	companyRepository: ICompanyRepositoryPort;
	completionStatusRepository: ICompletionStatusRepositoryPort;
	libraryManifestService: ILibraryManifestServicePort;
	eventBus: IDomainEventBusPort;
	clock: IClockPort;
};
