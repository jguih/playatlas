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
	makeGenreFactory,
	makeGenreMapper,
	makePlatformFactory,
	makePlatformMapper,
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

	const platformFactory = makePlatformFactory({ clock });
	const platformMapper = makePlatformMapper({ platformFactory });
	const platformRepository = makePlatformRepository({
		getDb,
		logService: buildLog("PlatformRepository"),
		platformMapper,
	});
	const queryHandlerGetAllPlatforms = makeGetAllPlatformQueryHandler({
		platformRepository: platformRepository,
		platformMapper,
	});

	const genreFactory = makeGenreFactory({ clock });
	const genreMapper = makeGenreMapper({ genreFactory });
	const genreRepository = makeGenreRepository({
		getDb,
		logService: buildLog("GenreRepository"),
		genreMapper,
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
		getPlatformRepository: () => platformRepository,
		getCompletionStatusRepository: () => completionStatusRepository,
		queries: {
			getGetAllGamesQueryHandler: () => getAllGamesQueryHandler,
			getGetAllCompaniesQueryHandler: () => getAllCompaniesQueryHandler,
			getGetAllPlatformsQueryHandler: () => queryHandlerGetAllPlatforms,
			getGetAllGenresQueryHandler: () => _query_handler_get_all_genres,
		},
		getGameAssetsContextFactory: () => gameAssetsContextFactory,
		getGameFactory: () => gameFactory,
		getGameMapper: () => gameMapper,
		getCompanyFactory: () => companyFactory,
		getCompanyMapper: () => companyMapper,
		getCompletionStatusFactory: () => completionStatusFactory,
		getCompletionStatusMapper: () => completionStatusMapper,
		getPlatformFactory: () => platformFactory,
		getPlatformMapper: () => platformMapper,
		getGenreFactory: () => genreFactory,
		getGenreMapper: () => genreMapper,
	};
	return Object.freeze(gameLibrary);
};
