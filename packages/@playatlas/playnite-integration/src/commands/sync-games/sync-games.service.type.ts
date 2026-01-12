import type { ILogServicePort } from "@playatlas/common/application";
import type { AsyncCommandHandler } from "@playatlas/common/common";
import type {
  ICompanyRepositoryPort,
  ICompletionStatusRepositoryPort,
  IGameRepositoryPort,
  IGenreRepositoryPort,
  IPlatformRepositoryPort,
} from "@playatlas/game-library/infra";
import type { ILibraryManifestServicePort } from "../../application";
import type { SyncGamesCommand } from "./sync-games.command";

export type SyncGamesCommandResult = {
  success: boolean;
  reason: string;
  reason_code: "game_not_found" | "success" | "integrity_check_failed";
};

export type ISyncGamesCommandHandlerPort = AsyncCommandHandler<
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
};
