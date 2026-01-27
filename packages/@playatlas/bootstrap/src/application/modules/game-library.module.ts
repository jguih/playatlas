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
	makeGameLibraryUnitOfWork,
	makeGameRepository,
	makeGenreRepository,
	makePlatformRepository,
} from "@playatlas/game-library/infra";
import {
	makeGetAllCompaniesQueryHandler,
	makeGetAllCompletionStatusesQueryHandler,
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
		gameMapper,
	});
	const queryHandlerGetAllGames = makeGetAllGamesQueryHandler({
		gameRepository,
		gameMapper,
		clock,
		logService: buildLog("GetAllGamesQueryHandler"),
	});

	const companyFactory = makeCompanyFactory({ clock });
	const companyMapper = makeCompanyMapper({ companyFactory: companyFactory });
	const companyRepository = makeCompanyRepository({
		getDb,
		logService: buildLog("CompanyRepository"),
		companyMapper,
	});
	const queryHandlerGetAllCompanies = makeGetAllCompaniesQueryHandler({
		companyRepository,
		companyMapper,
		clock,
		logService: buildLog("GetAllCompaniesQueryHandler"),
	});

	const completionStatusFactory = makeCompletionStatusFactory({ clock });
	const completionStatusMapper = makeCompletionStatusMapper({ completionStatusFactory });
	const completionStatusRepository = makeCompletionStatusRepository({
		getDb,
		logService: buildLog("CompletionStatusRepository"),
		completionStatusMapper,
	});
	const queryHandlerGetAllCompletionStatuses = makeGetAllCompletionStatusesQueryHandler({
		completionStatusMapper,
		completionStatusRepository,
		clock,
		logService: buildLog("GetAllCompletionStatusesQueryHandler"),
	});

	const platformFactory = makePlatformFactory({ clock });
	const platformMapper = makePlatformMapper({ platformFactory });
	const platformRepository = makePlatformRepository({
		getDb,
		logService: buildLog("PlatformRepository"),
		platformMapper,
	});
	const queryHandlerGetAllPlatforms = makeGetAllPlatformQueryHandler({
		platformRepository,
		platformMapper,
	});

	const genreFactory = makeGenreFactory({ clock });
	const genreMapper = makeGenreMapper({ genreFactory });
	const genreRepository = makeGenreRepository({
		getDb,
		logService: buildLog("GenreRepository"),
		genreMapper,
	});
	const queryHandlerGetAllGenres = makeGetAllGenresQueryHandler({
		genreRepository,
		genreMapper,
		logService: buildLog("GetAllGenresQueryHandler"),
		clock,
	});

	const gameAssetsContextFactory = makeGameAssetsContextFactory({
		fileSystemService,
		logServiceFactory,
		systemConfig,
	});

	const gameLibraryUnitOfWork = makeGameLibraryUnitOfWork({
		companyFactory,
		companyRepository,
		completionStatusFactory,
		completionStatusRepository,
		genreFactory,
		genreRepository,
		gameFactory,
		gameRepository,
		platformFactory,
		platformRepository,
		getDb,
	});

	const gameLibrary: IGameLibraryModulePort = {
		getCompanyRepository: () => companyRepository,
		getGameRepository: () => gameRepository,
		getGenreRepository: () => genreRepository,
		getPlatformRepository: () => platformRepository,
		getCompletionStatusRepository: () => completionStatusRepository,

		queries: {
			getGetAllGamesQueryHandler: () => queryHandlerGetAllGames,
			getGetAllCompaniesQueryHandler: () => queryHandlerGetAllCompanies,
			getGetAllPlatformsQueryHandler: () => queryHandlerGetAllPlatforms,
			getGetAllGenresQueryHandler: () => queryHandlerGetAllGenres,
			getGetAllCompletionStatusesQueryHandler: () => queryHandlerGetAllCompletionStatuses,
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
		getGameLibraryUnitOfWork: () => gameLibraryUnitOfWork,
	};
	return Object.freeze(gameLibrary);
};
