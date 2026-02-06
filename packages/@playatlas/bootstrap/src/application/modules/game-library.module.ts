import {
	type IFileSystemServicePort,
	type ILogServiceFactoryPort,
} from "@playatlas/common/application";
import type { DbGetter, IClockPort, ISystemConfigPort } from "@playatlas/common/infra";
import {
	makeClassificationFactory,
	makeClassificationMapper,
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
import { makeApplyDefaultClassificationsCommandHandler } from "@playatlas/game-library/commands";
import {
	makeClassificationRepository,
	makeCompanyRepository,
	makeCompletionStatusRepository,
	makeGameAssetsContextFactory,
	makeGameAssetsReindexer,
	makeGameLibraryUnitOfWork,
	makeGameRelationshipStore,
	makeGameRepository,
	makeGenreRepository,
	makePlatformRepository,
} from "@playatlas/game-library/infra";
import {
	makeGetAllClassificationsQueryHandler,
	makeGetAllCompaniesQueryHandler,
	makeGetAllCompletionStatusesQueryHandler,
	makeGetAllGamesQueryHandler,
	makeGetAllGenresQueryHandler,
	makeGetAllPlatformQueryHandler,
} from "@playatlas/game-library/queries";
import type { IGameLibraryModulePort } from "./game-library.module.port";

export type GameLibraryModuleDeps = {
	getDb: DbGetter;
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
	const relationshipStore = makeGameRelationshipStore({ getDb });
	const gameRepository = makeGameRepository({
		getDb,
		logService: buildLog("GameRepository"),
		gameMapper,
		relationshipStore,
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
		logService: buildLog("GetAllPlatformsQueryHandler"),
		clock,
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
	const gameAssetsReindexer = makeGameAssetsReindexer({
		fileSystemService,
		gameAssetsContextFactory,
		gameRepository,
		logService: buildLog("GameAssetsReindexer"),
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

	const classificationFactory = makeClassificationFactory({ clock });
	const classificationMapper = makeClassificationMapper({ classificationFactory });
	const classificationRepository = makeClassificationRepository({
		classificationMapper,
		getDb,
		logService: buildLog("ClassificationRepository"),
	});
	const applyDefaultClassificationsQueryHandler = makeApplyDefaultClassificationsCommandHandler({
		classificationFactory,
		classificationRepository,
		logService: buildLog("ApplyDefaultClassificationsQueryHandler"),
	});
	const getAllClassificationsQueryHandler = makeGetAllClassificationsQueryHandler({
		classificationRepository,
	});

	const gameLibrary: IGameLibraryModulePort = {
		getCompanyRepository: () => companyRepository,
		getGameRepository: () => gameRepository,
		getGenreRepository: () => genreRepository,
		getPlatformRepository: () => platformRepository,
		getCompletionStatusRepository: () => completionStatusRepository,

		queries: {
			getGetAllClassificationsQueryHandler: () => getAllClassificationsQueryHandler,
			getGetAllGamesQueryHandler: () => queryHandlerGetAllGames,
			getGetAllCompaniesQueryHandler: () => queryHandlerGetAllCompanies,
			getGetAllPlatformsQueryHandler: () => queryHandlerGetAllPlatforms,
			getGetAllGenresQueryHandler: () => queryHandlerGetAllGenres,
			getGetAllCompletionStatusesQueryHandler: () => queryHandlerGetAllCompletionStatuses,
		},

		commands: {
			getApplyDefaultClassificationsCommandHandler: () => applyDefaultClassificationsQueryHandler,
		},

		getGameAssetsContextFactory: () => gameAssetsContextFactory,
		getGameAssetsReindexer: () => gameAssetsReindexer,

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

		getClassificationMapper: () => classificationMapper,
		getClassificationFactory: () => classificationFactory,
		getClassificationRepository: () => classificationRepository,

		init: () => {
			applyDefaultClassificationsQueryHandler.execute({ type: "default" });
		},
	};
	return Object.freeze(gameLibrary);
};
