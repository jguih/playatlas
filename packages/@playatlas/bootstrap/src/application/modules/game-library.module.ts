import {
	type IFileSystemServicePort,
	type ILogServiceFactoryPort,
} from "@playatlas/common/application";
import type { BaseRepositoryDeps, IClockPort, ISystemConfigPort } from "@playatlas/common/infra";
import {
	makeCompanyFactory,
	makeCompanyMapper,
	makeCompletionStatusFactory,
	makeCompletionStatusMapper,
	makeGameFactory,
	makeGameMapper,
} from "@playatlas/game-library/application";
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
	clock: IClockPort;
};

export const makeGameLibraryModule = ({
	getDb,
	logServiceFactory,
	fileSystemService,
	systemConfig,
	clock,
}: GameLibraryModuleDeps): IGameLibraryModulePort => {
	const buildLog = (ctx: string) => logServiceFactory.build(ctx);

	const gameFactory = makeGameFactory({ clock });
	const gameMapper = makeGameMapper({ gameFactory });
	const gameRepository = makeGameRepository({
		getDb,
		logService: buildLog("GameRepository"),
		gameMapper: gameMapper,
	});
	const getAllGamesQueryHandler = makeGetAllGamesQueryHandler({
		gameRepository: gameRepository,
		gameMapper: gameMapper,
	});

	const companyFactory = makeCompanyFactory({ clock });
	const companyMapper = makeCompanyMapper({ companyFactory: companyFactory });
	const companyRepository = makeCompanyRepository({
		getDb,
		logService: buildLog("CompanyRepository"),
		companyMapper: companyMapper,
	});
	const getAllCompaniesQueryHandler = makeGetAllCompaniesQueryHandler({
		companyRepository: companyRepository,
		companyMapper: companyMapper,
	});

	const completionStatusFactory = makeCompletionStatusFactory({ clock });
	const completionStatusMapper = makeCompletionStatusMapper({ completionStatusFactory });
	const completionStatusRepository = makeCompletionStatusRepository({
		getDb,
		logService: buildLog("CompletionStatusRepository"),
		completionStatusMapper,
	});

	const genreRepository = makeGenreRepository({
		getDb,
		logService: buildLog("GenreRepository"),
	});
	const _platform_repository = makePlatformRepository({
		getDb,
		logService: buildLog("PlatformRepository"),
	});

	const _query_handler_get_all_platforms = makeGetAllPlatformQueryHandler({
		platformRepository: _platform_repository,
	});
	const _query_handler_get_all_genres = makeGetAllGenresQueryHandler({
		genreRepository: genreRepository,
	});

	const gameAssetsContextFactory = makeGameAssetsContextFactory({
		fileSystemService,
		logServiceFactory,
		systemConfig,
	});

	const gameLibrary: IGameLibraryModulePort = {
		getCompanyRepository: () => companyRepository,
		getGameRepository: () => gameRepository,
		getGenreRepository: () => genreRepository,
		getPlatformRepository: () => _platform_repository,
		getCompletionStatusRepository: () => completionStatusRepository,
		queries: {
			getGetAllGamesQueryHandler: () => getAllGamesQueryHandler,
			getGetAllCompaniesQueryHandler: () => getAllCompaniesQueryHandler,
			getGetAllPlatformsQueryHandler: () => _query_handler_get_all_platforms,
			getGetAllGenresQueryHandler: () => _query_handler_get_all_genres,
		},
		getGameAssetsContextFactory: () => gameAssetsContextFactory,
		getGameFactory: () => gameFactory,
		getGameMapper: () => gameMapper,
		getCompanyFactory: () => companyFactory,
		getCompanyMapper: () => companyMapper,
		getCompletionStatusFactory: () => completionStatusFactory,
	};
	return Object.freeze(gameLibrary);
};
