import type {
	IClassificationFactoryPort,
	IClassificationMapperPort,
	ICompanyFactoryPort,
	ICompanyMapperPort,
	ICompletionStatusFactoryPort,
	ICompletionStatusMapperPort,
	IGameClassificationFactoryPort,
	IGameClassificationMapperPort,
	IGameClassificationScoreServicePort,
	IGameFactoryPort,
	IGameLibraryUnitOfWorkPort,
	IGameMapperPort,
	IGenreFactoryPort,
	IGenreMapperPort,
	IPlatformFactoryPort,
	IPlatformMapperPort,
	IScoreEngineRegistryPort,
} from "@playatlas/game-library/application";
import type { IApplyDefaultClassificationsCommandHandlerPort } from "@playatlas/game-library/commands";
import type {
	IClassificationRepositoryPort,
	ICompanyRepositoryPort,
	ICompletionStatusRepositoryPort,
	IGameAssetsContextFactoryPort,
	IGameAssetsReindexerPort,
	IGameClassificationRepositoryPort,
	IGameRepositoryPort,
	IGenreRepositoryPort,
	IPlatformRepositoryPort,
} from "@playatlas/game-library/infra";
import type {
	IGetAllClassificationsQueryHandler,
	IGetAllCompaniesQueryHandlerPort,
	IGetAllCompletionStatusesQueryHandlerPort,
	IGetAllGamesQueryHandlerPort,
	IGetAllGenresQueryHandlerPort,
	IGetAllPlatformsQueryHandlerPort,
} from "@playatlas/game-library/queries";

export type IGameLibraryModulePort = Readonly<{
	queries: {
		getGetAllClassificationsQueryHandler: () => IGetAllClassificationsQueryHandler;
		getGetAllGamesQueryHandler: () => IGetAllGamesQueryHandlerPort;
		getGetAllCompaniesQueryHandler: () => IGetAllCompaniesQueryHandlerPort;
		getGetAllPlatformsQueryHandler: () => IGetAllPlatformsQueryHandlerPort;
		getGetAllGenresQueryHandler: () => IGetAllGenresQueryHandlerPort;
		getGetAllCompletionStatusesQueryHandler: () => IGetAllCompletionStatusesQueryHandlerPort;
	};

	commands: {
		getApplyDefaultClassificationsCommandHandler: () => IApplyDefaultClassificationsCommandHandlerPort;
	};

	getGameAssetsContextFactory: () => IGameAssetsContextFactoryPort;
	getGameAssetsReindexer: () => IGameAssetsReindexerPort;

	getGameMapper: () => IGameMapperPort;
	getGameFactory: () => IGameFactoryPort;
	getGameRepository: () => IGameRepositoryPort;

	getCompanyMapper: () => ICompanyMapperPort;
	getCompanyFactory: () => ICompanyFactoryPort;
	getCompanyRepository: () => ICompanyRepositoryPort;

	getCompletionStatusMapper: () => ICompletionStatusMapperPort;
	getCompletionStatusFactory: () => ICompletionStatusFactoryPort;
	getCompletionStatusRepository: () => ICompletionStatusRepositoryPort;

	getPlatformMapper: () => IPlatformMapperPort;
	getPlatformFactory: () => IPlatformFactoryPort;
	getPlatformRepository: () => IPlatformRepositoryPort;

	getGenreMapper: () => IGenreMapperPort;
	getGenreFactory: () => IGenreFactoryPort;
	getGenreRepository: () => IGenreRepositoryPort;

	getGameLibraryUnitOfWork: () => IGameLibraryUnitOfWorkPort;

	scoreEngine: {
		getClassificationMapper: () => IClassificationMapperPort;
		getClassificationFactory: () => IClassificationFactoryPort;
		getClassificationRepository: () => IClassificationRepositoryPort;

		getGameClassificationMapper: () => IGameClassificationMapperPort;
		getGameClassificationFactory: () => IGameClassificationFactoryPort;
		getGameClassificationRepository: () => IGameClassificationRepositoryPort;

		getScoreEngineRegistry: () => IScoreEngineRegistryPort;
		getGameClassificationScoreService: () => IGameClassificationScoreServicePort;
	};

	init: () => void;
}>;
