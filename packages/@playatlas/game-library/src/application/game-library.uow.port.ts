import type {
	ICompanyRepositoryPort,
	ICompletionStatusRepositoryPort,
	IGameRepositoryPort,
	IGenreRepositoryPort,
	IPlatformRepositoryPort,
} from "../infra";
import type { ICompanyFactoryPort } from "./company.factory";
import type { ICompletionStatusFactoryPort } from "./completion-status.factory";
import type { IGameFactoryPort } from "./game.factory";
import type { IGenreFactoryPort } from "./genre.factory";
import type { IPlatformFactoryPort } from "./platform.factory";
import type { IGameClassificationScoreServicePort } from "./scoring-engine";

export type GameLibraryUnitOfWorkContext = {
	repositories: {
		gameRepository: IGameRepositoryPort;
		genreRepository: IGenreRepositoryPort;
		platformRepository: IPlatformRepositoryPort;
		companyRepository: ICompanyRepositoryPort;
		completionStatusRepository: ICompletionStatusRepositoryPort;
	};
	factories: {
		gameFactory: IGameFactoryPort;
		genreFactory: IGenreFactoryPort;
		platformFactory: IPlatformFactoryPort;
		companyFactory: ICompanyFactoryPort;
		completionStatusFactory: ICompletionStatusFactoryPort;
	};
	gameClassificationScoreService: IGameClassificationScoreServicePort;
};

export type IGameLibraryUnitOfWorkPort = {
	run: <T>(fn: (ctx: GameLibraryUnitOfWorkContext) => T) => T;
	runAsync: <T>(fn: (ctx: GameLibraryUnitOfWorkContext) => Promise<T>) => Promise<T>;
};
