import { runTransaction, runTransactionAsync } from "@playatlas/common/infra";
import type { DatabaseSync } from "node:sqlite";
import type {
	GameLibraryUnitOfWorkContext,
	ICompanyFactoryPort,
	ICompletionStatusFactoryPort,
	IGameClassificationScoreServicePort,
	IGameFactoryPort,
	IGameLibraryUnitOfWorkPort,
	IGenreFactoryPort,
	IPlatformFactoryPort,
} from "../application";
import type { ICompanyRepositoryPort } from "./company.repository.port";
import type { ICompletionStatusRepositoryPort } from "./completion-status.repository.port";
import type { IGameRepositoryPort } from "./game.repository.port";
import type { IGenreRepositoryPort } from "./genre.repository.port";
import type { IPlatformRepositoryPort } from "./platform.repository.port";

export type GameLibraryUnitOfWorkDeps = {
	gameRepository: IGameRepositoryPort;
	genreRepository: IGenreRepositoryPort;
	platformRepository: IPlatformRepositoryPort;
	companyRepository: ICompanyRepositoryPort;
	completionStatusRepository: ICompletionStatusRepositoryPort;
	gameFactory: IGameFactoryPort;
	companyFactory: ICompanyFactoryPort;
	completionStatusFactory: ICompletionStatusFactoryPort;
	platformFactory: IPlatformFactoryPort;
	genreFactory: IGenreFactoryPort;
	gameClassificationScoreService: IGameClassificationScoreServicePort;
	getDb: () => DatabaseSync;
};

export const makeGameLibraryUnitOfWork = ({
	companyFactory,
	companyRepository,
	completionStatusFactory,
	gameFactory,
	gameRepository,
	genreFactory,
	genreRepository,
	platformFactory,
	platformRepository,
	completionStatusRepository,
	gameClassificationScoreService,
	getDb,
}: GameLibraryUnitOfWorkDeps): IGameLibraryUnitOfWorkPort => {
	const ctx: GameLibraryUnitOfWorkContext = {
		factories: {
			companyFactory,
			completionStatusFactory,
			gameFactory,
			genreFactory,
			platformFactory,
		},
		repositories: {
			gameRepository,
			genreRepository,
			companyRepository,
			completionStatusRepository,
			platformRepository,
		},
		gameClassificationScoreService,
	};

	return {
		run: (fn) => {
			return runTransaction({ getDb, fn: () => fn(ctx) });
		},
		runAsync: async (fn) => {
			return await runTransactionAsync({ getDb, fn: () => fn(ctx) });
		},
	};
};
