import {
	type IFileSystemServicePort,
	type ILogServiceFactoryPort,
} from "@playatlas/common/application";
import type { BaseRepositoryDeps, ISystemConfigPort } from "@playatlas/common/infra";
import {
	makeCompanyRepository,
	makeCompletionStatusRepository,
	makeGameAssetsContextFactory,
	makeGameRepository,
	makeGenreRepository,
	makePlatformRepository,
} from "@playatlas/game-library/infra";
import {
	makeGetAllCompaniesQueryHandler,
	makeGetAllGamesQueryHandler,
	makeGetAllGenresQueryHandler,
	makeGetAllPlatformQueryHandler,
} from "@playatlas/game-library/queries";
import type { IGameLibraryModulePort } from "./game-library.module.port";

export type GameLibraryModuleDeps = {
	getDb: BaseRepositoryDeps["getDb"];
	logServiceFactory: ILogServiceFactoryPort;
	fileSystemService: IFileSystemServicePort;
	systemConfig: ISystemConfigPort;
};

export const makeGameLibraryModule = ({
	getDb,
	logServiceFactory,
	fileSystemService,
	systemConfig,
}: GameLibraryModuleDeps): IGameLibraryModulePort => {
	const _company_repository = makeCompanyRepository({
		getDb,
		logService: logServiceFactory.build("CompanyRepository"),
	});
	const _genre_repository = makeGenreRepository({
		getDb,
		logService: logServiceFactory.build("GenreRepository"),
	});
	const _game_repository = makeGameRepository({
		getDb,
		logService: logServiceFactory.build("GameRepository"),
	});
	const _platform_repository = makePlatformRepository({
		getDb,
		logService: logServiceFactory.build("PlatformRepository"),
	});
	const _completion_status_repository = makeCompletionStatusRepository({
		getDb,
		logService: logServiceFactory.build("CompletionStatusRepository"),
	});
	const _query_handler_get_all_games = makeGetAllGamesQueryHandler({
		gameRepository: _game_repository,
	});
	const _query_handler_get_all_companies = makeGetAllCompaniesQueryHandler({
		companyRepository: _company_repository,
	});
	const _query_handler_get_all_platforms = makeGetAllPlatformQueryHandler({
		platformRepository: _platform_repository,
	});
	const _query_handler_get_all_genres = makeGetAllGenresQueryHandler({
		genreRepository: _genre_repository,
	});
	const _game_assets_context_factory = makeGameAssetsContextFactory({
		fileSystemService,
		logServiceFactory,
		systemConfig,
	});

	const gameLibrary: IGameLibraryModulePort = {
		getCompanyRepository: () => _company_repository,
		getGameRepository: () => _game_repository,
		getGenreRepository: () => _genre_repository,
		getPlatformRepository: () => _platform_repository,
		getCompletionStatusRepository: () => _completion_status_repository,
		queries: {
			getGetAllGamesQueryHandler: () => _query_handler_get_all_games,
			getGetAllCompaniesQueryHandler: () => _query_handler_get_all_companies,
			getGetAllPlatformsQueryHandler: () => _query_handler_get_all_platforms,
			getGetAllGenresQueryHandler: () => _query_handler_get_all_genres,
		},
		getGameAssetsContextFactory: () => _game_assets_context_factory,
	};
	return Object.freeze(gameLibrary);
};
