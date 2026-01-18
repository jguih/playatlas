import type {
	ICompanyFactoryPort,
	ICompanyMapperPort,
	ICompletionStatusFactoryPort,
	ICompletionStatusMapperPort,
	IGameFactoryPort,
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
	IGameRepositoryPort,
	IGenreRepositoryPort,
	IPlatformRepositoryPort,
} from "@playatlas/game-library/infra";
import type {
	IGetAllCompaniesQueryHandlerPort,
	IGetAllGamesQueryHandlerPort,
	IGetAllGenresQueryHandlerPort,
	IGetAllPlatformsQueryHandlerPort,
} from "@playatlas/game-library/queries";

export type IGameLibraryModulePort = Readonly<{
	getCompanyRepository: () => ICompanyRepositoryPort;
	getGenreRepository: () => IGenreRepositoryPort;
	getGameRepository: () => IGameRepositoryPort;
	getPlatformRepository: () => IPlatformRepositoryPort;
	getCompletionStatusRepository: () => ICompletionStatusRepositoryPort;
	queries: {
		getGetAllGamesQueryHandler: () => IGetAllGamesQueryHandlerPort;
		getGetAllCompaniesQueryHandler: () => IGetAllCompaniesQueryHandlerPort;
		getGetAllPlatformsQueryHandler: () => IGetAllPlatformsQueryHandlerPort;
		getGetAllGenresQueryHandler: () => IGetAllGenresQueryHandlerPort;
	};
	getGameAssetsContextFactory: () => IGameAssetsContextFactoryPort;

	getGameMapper: () => IGameMapperPort;
	getGameFactory: () => IGameFactoryPort;

	getCompanyMapper: () => ICompanyMapperPort;
	getCompanyFactory: () => ICompanyFactoryPort;

	getCompletionStatusFactory: () => ICompletionStatusFactoryPort;
	getCompletionStatusMapper: () => ICompletionStatusMapperPort;

	getPlatformMapper: () => IPlatformMapperPort;
	getPlatformFactory: () => IPlatformFactoryPort;

	getGenreMapper: () => IGenreMapperPort;
	getGenreFactory: () => IGenreFactoryPort;
}>;
