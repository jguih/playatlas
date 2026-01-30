import type {
	ICompanyFactoryPort,
	ICompanyMapperPort,
	ICompletionStatusFactoryPort,
	ICompletionStatusMapperPort,
	IGameFactoryPort,
	IGameLibraryUnitOfWorkPort,
	IGameMapperPort,
	IGenreFactoryPort,
	IGenreMapperPort,
	IPlatformFactoryPort,
	IPlatformMapperPort,
} from "@playatlas/game-library/application";
import type {
	ICompanyRepositoryPort,
	ICompletionStatusRepositoryPort,
	IGameAssetsContextFactoryPort,
	IGameAssetsReindexerPort,
	IGameRepositoryPort,
	IGenreRepositoryPort,
	IPlatformRepositoryPort,
} from "@playatlas/game-library/infra";
import type {
	IGetAllCompaniesQueryHandlerPort,
	IGetAllCompletionStatusesQueryHandlerPort,
	IGetAllGamesQueryHandlerPort,
	IGetAllGenresQueryHandlerPort,
	IGetAllPlatformsQueryHandlerPort,
} from "@playatlas/game-library/queries";

export type IGameLibraryModulePort = Readonly<{
	queries: {
		getGetAllGamesQueryHandler: () => IGetAllGamesQueryHandlerPort;
		getGetAllCompaniesQueryHandler: () => IGetAllCompaniesQueryHandlerPort;
		getGetAllPlatformsQueryHandler: () => IGetAllPlatformsQueryHandlerPort;
		getGetAllGenresQueryHandler: () => IGetAllGenresQueryHandlerPort;
		getGetAllCompletionStatusesQueryHandler: () => IGetAllCompletionStatusesQueryHandlerPort;
	};

	getGameAssetsContextFactory: () => IGameAssetsContextFactoryPort;
	getGameAssetsReindexer: () => IGameAssetsReindexerPort;

	getGameMapper: () => IGameMapperPort;
	getGameFactory: () => IGameFactoryPort;
	getGameRepository: () => IGameRepositoryPort;

	getCompanyMapper: () => ICompanyMapperPort;
	getCompanyFactory: () => ICompanyFactoryPort;
	getCompanyRepository: () => ICompanyRepositoryPort;

	getCompletionStatusRepository: () => ICompletionStatusRepositoryPort;
	getCompletionStatusFactory: () => ICompletionStatusFactoryPort;
	getCompletionStatusMapper: () => ICompletionStatusMapperPort;

	getPlatformMapper: () => IPlatformMapperPort;
	getPlatformFactory: () => IPlatformFactoryPort;
	getPlatformRepository: () => IPlatformRepositoryPort;

	getGenreMapper: () => IGenreMapperPort;
	getGenreFactory: () => IGenreFactoryPort;
	getGenreRepository: () => IGenreRepositoryPort;

	getGameLibraryUnitOfWork: () => IGameLibraryUnitOfWorkPort;
}>;
