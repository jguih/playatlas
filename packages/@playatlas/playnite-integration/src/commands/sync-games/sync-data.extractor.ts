import {
	CompanyIdParser,
	CompletionStatusIdParser,
	GameIdParser,
	GenreIdParser,
	PlatformIdParser,
	PlayniteGameIdParser,
	type CompanyId,
	type CompletionStatusId,
	type GenreId,
	type PlatformId,
	type PlayniteGameId,
} from "@playatlas/common/domain";
import type {
	ICompanyFactoryPort,
	ICompletionStatusFactoryPort,
	IGameFactoryPort,
	IGenreFactoryPort,
	IPlatformFactoryPort,
} from "@playatlas/game-library/application";
import {
	type Company,
	type CompletionStatus,
	type Game,
	type Genre,
	type Platform,
	type PlayniteGameSnapshot,
} from "@playatlas/game-library/domain";
import type {
	ICompanyRepositoryPort,
	ICompletionStatusRepositoryPort,
	IGameRepositoryPort,
	IGenreRepositoryPort,
	IPlatformRepositoryPort,
} from "@playatlas/game-library/infra";
import { monotonicFactory } from "ulid";
import type { SyncGamesCommand, SyncGamesCommandItem } from "./sync-games.command";

export type ExtractedSyncData = {
	genres: Genre[];
	platforms: Platform[];
	developers: Company[];
	publishers: Company[];
	completionStatuses: CompletionStatus[];
	games: Game[];
	added: PlayniteGameId[];
	updated: PlayniteGameId[];
	deleted: PlayniteGameId[];
};

export type SyncDataExtractorDeps = {
	command: SyncGamesCommand;
	now: Date;
	gameFactory: IGameFactoryPort;
	companyFactory: ICompanyFactoryPort;
	completionStatusFactory: ICompletionStatusFactoryPort;
	platformFactory: IPlatformFactoryPort;
	genreFactory: IGenreFactoryPort;
	context: GameLibrarySyncContext;
};

export const extractSyncData = ({
	command: { payload },
	now,
	context,
	companyFactory,
	completionStatusFactory,
	gameFactory,
	platformFactory,
	genreFactory,
}: SyncDataExtractorDeps): ExtractedSyncData => {
	const genres = new Map<GenreId, Genre>();
	const platforms = new Map<PlatformId, Platform>();
	const developers = new Map<CompanyId, Company>();
	const publishers = new Map<CompanyId, Company>();
	const completionStatuses = new Map<CompletionStatusId, CompletionStatus>();
	const games = new Map<PlayniteGameId, Game>();
	const added: PlayniteGameId[] = [];
	const updated: PlayniteGameId[] = [];
	const deleted: PlayniteGameId[] = [];
	const ulid = monotonicFactory();

	const processCommandItem = (item: SyncGamesCommandItem) => {
		item.Genres?.forEach((g) => {
			const genreId = GenreIdParser.fromExternal(g.Id);
			const existing = context.genres.get(genreId) ?? genres.get(genreId);

			if (existing) {
				const didUpdate = existing.updateFromPlaynite({ name: g.Name });
				if (didUpdate) genres.set(genreId, existing);
			} else {
				const newGenre = genreFactory.create({
					id: genreId,
					name: g.Name,
					lastUpdatedAt: now,
					createdAt: now,
				});
				genres.set(genreId, newGenre);
			}
		});

		item.Platforms?.forEach((p) => {
			const platformId = PlatformIdParser.fromExternal(p.Id);
			const existing = context.platforms.get(platformId) ?? platforms.get(platformId);

			if (existing) {
				const didUpdate = existing.updateFromPlaynite({
					name: p.Name,
					specificationId: p.SpecificationId,
					background: p.Background,
					cover: p.Cover,
					icon: p.Icon,
				});
				if (didUpdate) platforms.set(platformId, existing);
			} else {
				const newPlatform = platformFactory.create({
					id: platformId,
					specificationId: p.SpecificationId,
					name: p.Name,
					icon: p.Icon,
					cover: p.Cover,
					background: p.Background,
					lastUpdatedAt: now,
					createdAt: now,
				});
				platforms.set(platformId, newPlatform);
			}
		});

		item.Developers?.forEach((d) => {
			const companyId = CompanyIdParser.fromExternal(d.Id);
			const existing = context.companies.get(companyId) ?? developers.get(companyId);

			if (existing) {
				const didUpdate = existing.updateFromPlaynite({ name: d.Name });
				if (didUpdate) developers.set(companyId, existing);
			} else {
				const newCompany = companyFactory.create({
					id: companyId,
					name: d.Name,
					lastUpdatedAt: now,
					createdAt: now,
				});
				developers.set(companyId, newCompany);
			}
		});

		item.Publishers?.forEach((p) => {
			const companyId = CompanyIdParser.fromExternal(p.Id);
			const existing = context.companies.get(companyId) ?? publishers.get(companyId);

			if (existing) {
				const didUpdate = existing.updateFromPlaynite({ name: p.Name });
				if (didUpdate) publishers.set(companyId, existing);
			} else {
				const newCompany = companyFactory.create({
					id: companyId,
					name: p.Name,
					lastUpdatedAt: now,
					createdAt: now,
				});
				publishers.set(companyId, newCompany);
			}
		});

		if (item.CompletionStatus) {
			const completionStatusId = CompletionStatusIdParser.fromExternal(item.CompletionStatus.Id);
			const existing =
				context.completionStatuses.get(completionStatusId) ??
				completionStatuses.get(completionStatusId);

			if (existing) {
				const didUpdate = existing.updateFromPlaynite({ name: item.CompletionStatus.Name });
				if (didUpdate) completionStatuses.set(completionStatusId, existing);
			} else {
				const newCompletionStatus = completionStatusFactory.create({
					id: completionStatusId,
					name: item.CompletionStatus.Name,
					lastUpdatedAt: now,
					createdAt: now,
				});
				completionStatuses.set(completionStatusId, newCompletionStatus);
			}
		}

		const itemPlayniteGameId = PlayniteGameIdParser.fromExternal(item.Id);
		const existingGame = context.games.get(itemPlayniteGameId) ?? games.get(itemPlayniteGameId);

		const playniteSnapshot: PlayniteGameSnapshot = {
			id: itemPlayniteGameId,
			name: item.Name ?? null,
			added: item.Added ? new Date(item.Added) : null,
			backgroundImage: item.BackgroundImage ?? null,
			coverImage: item.CoverImage ?? null,
			icon: item.Icon ?? null,
			completionStatusId: item.CompletionStatus?.Id ?? null,
			description: item.Description ?? null,
			hidden: item.Hidden,
			installDirectory: item.InstallDirectory ?? null,
			isInstalled: item.IsInstalled,
			lastActivity: item.LastActivity ? new Date(item.LastActivity) : null,
			playtime: item.Playtime,
			releaseDate: item.ReleaseDate ? new Date(item.ReleaseDate) : null,
		};

		const developerIds = item.Developers?.map((d) => CompanyIdParser.fromExternal(d.Id)) ?? [];
		const genreIds = item.Genres?.map((g) => GenreIdParser.fromExternal(g.Id)) ?? [];
		const publisherIds = item.Publishers?.map((p) => CompanyIdParser.fromExternal(p.Id)) ?? [];
		const platformIds = item.Platforms?.map((p) => PlatformIdParser.fromExternal(p.Id)) ?? [];

		if (existingGame) {
			const didUpdate = existingGame.updateFromPlaynite({
				contentHash: item.ContentHash,
				playniteSnapshot,
				relationships: { developerIds, genreIds, platformIds, publisherIds },
			});
			if (didUpdate) games.set(itemPlayniteGameId, existingGame);
		} else {
			const newGame = gameFactory.create({
				id: GameIdParser.fromTrusted(ulid()),
				playniteSnapshot,
				developerIds: developerIds,
				genreIds: genreIds,
				publisherIds: publisherIds,
				platformIds: platformIds,
				lastUpdatedAt: now,
				createdAt: now,
				contentHash: item.ContentHash,
			});
			games.set(itemPlayniteGameId, newGame);
		}
	};

	for (const item of payload.toAdd) {
		processCommandItem(item);
		added.push(PlayniteGameIdParser.fromExternal(item.Id));
	}

	for (const item of payload.toUpdate) {
		processCommandItem(item);
		updated.push(PlayniteGameIdParser.fromExternal(item.Id));
	}

	for (const itemId of payload.toRemove) {
		const itemPlayniteGameId = PlayniteGameIdParser.fromExternal(itemId);
		const existingGame = context.games.has(itemPlayniteGameId)
			? context.games.get(itemPlayniteGameId)!
			: null;

		if (existingGame) {
			const didDelete = existingGame.delete();
			if (didDelete) {
				games.set(itemPlayniteGameId, existingGame);
				deleted.push(PlayniteGameIdParser.fromExternal(itemId));
			}
		}
	}

	return {
		genres: [...genres.values()],
		platforms: [...platforms.values()],
		developers: [...developers.values()],
		publishers: [...publishers.values()],
		completionStatuses: [...completionStatuses.values()],
		games: [...games.values()],
		added,
		updated,
		deleted,
	};
};

export type GameLibrarySyncContext = {
	readonly games: ReadonlyMap<PlayniteGameId, Game>;
	readonly genres: ReadonlyMap<GenreId, Genre>;
	readonly completionStatuses: ReadonlyMap<CompletionStatusId, CompletionStatus>;
	readonly platforms: ReadonlyMap<PlatformId, Platform>;
	readonly companies: ReadonlyMap<CompanyId, Company>;
};

export type GameLibrarySyncContextBuilderDeps = {
	gameRepository: IGameRepositoryPort;
	genreRepository: IGenreRepositoryPort;
	platformRepository: IPlatformRepositoryPort;
	completionStatusRepository: ICompletionStatusRepositoryPort;
	companyRepository: ICompanyRepositoryPort;
};

export const buildGameLibrarySyncContext = ({
	gameRepository,
	genreRepository,
	platformRepository,
	completionStatusRepository,
	companyRepository,
}: GameLibrarySyncContextBuilderDeps): GameLibrarySyncContext => {
	const _games = gameRepository.all();
	const games = new Map(_games.map((g) => [g.getPlayniteSnapshot().id, g]));
	const _genres = genreRepository.all();
	const genres = new Map(_genres.map((g) => [g.getId(), g]));
	const _platforms = platformRepository.all();
	const platforms = new Map(_platforms.map((p) => [p.getId(), p]));
	const _completionStatuses = completionStatusRepository.all();
	const completionStatuses = new Map(_completionStatuses.map((c) => [c.getId(), c]));
	const _companies = companyRepository.all();
	const companies = new Map(_companies.map((c) => [c.getId(), c]));

	return {
		games,
		genres,
		platforms,
		completionStatuses,
		companies,
	};
};
