import {
	CompanyIdParser,
	CompletionStatusIdParser,
	GameIdParser,
	GenreIdParser,
	PlatformIdParser,
	PlayniteCompanyIdParser,
	PlayniteCompletionStatusIdParser,
	PlayniteGameIdParser,
	PlayniteGenreIdParser,
	PlaynitePlatformIdParser,
	type CompanyId,
	type GameId,
	type GenreId,
	type PlatformId,
	type PlayniteCompanyId,
	type PlayniteCompletionStatusId,
	type PlayniteGameId,
	type PlayniteGenreId,
	type PlaynitePlatformId,
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
	type PlayniteGenreSnapshot,
	type PlaynitePlatformSnapshot,
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
	companies: Company[];
	completionStatuses: CompletionStatus[];
	games: Game[];
	added: GameId[];
	updated: GameId[];
	deleted: GameId[];
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
	const genres = new Map<PlayniteGenreId, Genre>();
	const platforms = new Map<PlaynitePlatformId, Platform>();
	const companies = new Map<PlayniteCompanyId, Company>();
	const completionStatuses = new Map<PlayniteCompletionStatusId, CompletionStatus>();
	const games = new Map<PlayniteGameId, Game>();
	const added: GameId[] = [];
	const updated: GameId[] = [];
	const deleted: GameId[] = [];
	const ulid = monotonicFactory();

	const processCommandItem = (item: SyncGamesCommandItem): Game | undefined => {
		let itemPlayniteCompletionStatusId: PlayniteCompletionStatusId | null = null;
		let itemCompletionStatus: CompletionStatus | undefined = undefined;
		const itemPublishers = new Set<CompanyId>();
		const itemDevelopers = new Set<CompanyId>();
		const itemPlatforms = new Set<PlatformId>();
		const itemGenres = new Set<GenreId>();

		item.Genres?.forEach((g) => {
			const playniteGenreId = PlayniteGenreIdParser.fromExternal(g.Id);
			const existing = context.genres.get(playniteGenreId) ?? genres.get(playniteGenreId);

			const playniteSnapshot: PlayniteGenreSnapshot = {
				id: playniteGenreId,
			};

			if (existing) {
				itemGenres.add(existing.getId());

				const didUpdate = existing.updateFromPlaynite({
					name: g.Name,
					playniteSnapshot,
				});
				if (didUpdate) genres.set(playniteGenreId, existing);
			} else {
				const newGenre = genreFactory.create({
					id: GenreIdParser.fromTrusted(ulid()),
					playniteSnapshot,
					name: g.Name,
					lastUpdatedAt: now,
					createdAt: now,
				});
				genres.set(playniteGenreId, newGenre);
				itemGenres.add(newGenre.getId());
			}
		});

		item.Platforms?.forEach((p) => {
			const playnitePlatformId = PlaynitePlatformIdParser.fromExternal(p.Id);
			const existing =
				context.platforms.get(playnitePlatformId) ?? platforms.get(playnitePlatformId);

			const playniteSnapshot: PlaynitePlatformSnapshot = {
				id: playnitePlatformId,
				specificationId: p.SpecificationId,
			};

			if (existing) {
				itemPlatforms.add(existing.getId());

				const didUpdate = existing.updateFromPlaynite({
					name: p.Name,
					playniteSnapshot,
				});
				if (didUpdate) platforms.set(playnitePlatformId, existing);
			} else {
				const newPlatform = platformFactory.create({
					id: PlatformIdParser.fromTrusted(ulid()),
					name: p.Name,
					playniteSnapshot,
					lastUpdatedAt: now,
					createdAt: now,
				});
				platforms.set(playnitePlatformId, newPlatform);
				itemPlatforms.add(newPlatform.getId());
			}
		});

		item.Developers?.forEach((d) => {
			const companyId = PlayniteCompanyIdParser.fromExternal(d.Id);
			const existing = context.companies.get(companyId) ?? companies.get(companyId);

			if (existing) {
				itemDevelopers.add(existing.getId());

				const didUpdate = existing.updateFromPlaynite({ name: d.Name, playniteId: companyId });
				if (didUpdate) companies.set(companyId, existing);
			} else {
				const newCompany = companyFactory.create({
					id: CompanyIdParser.fromTrusted(ulid()),
					playniteId: companyId,
					name: d.Name,
					lastUpdatedAt: now,
					createdAt: now,
				});
				companies.set(companyId, newCompany);
				itemDevelopers.add(newCompany.getId());
			}
		});

		item.Publishers?.forEach((p) => {
			const companyId = PlayniteCompanyIdParser.fromExternal(p.Id);
			const existing = context.companies.get(companyId) ?? companies.get(companyId);

			if (existing) {
				itemPublishers.add(existing.getId());

				const didUpdate = existing.updateFromPlaynite({ name: p.Name, playniteId: companyId });
				if (didUpdate) companies.set(companyId, existing);
			} else {
				const newCompany = companyFactory.create({
					id: CompanyIdParser.fromTrusted(ulid()),
					playniteId: companyId,
					name: p.Name,
					lastUpdatedAt: now,
					createdAt: now,
				});
				companies.set(companyId, newCompany);
				itemPublishers.add(newCompany.getId());
			}
		});

		if (item.CompletionStatus) {
			itemPlayniteCompletionStatusId = PlayniteCompletionStatusIdParser.fromExternal(
				item.CompletionStatus.Id,
			);
			itemCompletionStatus =
				context.completionStatuses.get(itemPlayniteCompletionStatusId) ??
				completionStatuses.get(itemPlayniteCompletionStatusId);

			if (itemCompletionStatus) {
				const didUpdate = itemCompletionStatus.updateFromPlaynite({
					name: item.CompletionStatus.Name,
					playniteId: itemPlayniteCompletionStatusId,
				});
				if (didUpdate) completionStatuses.set(itemPlayniteCompletionStatusId, itemCompletionStatus);
			} else {
				const newCompletionStatus = completionStatusFactory.create({
					id: CompletionStatusIdParser.fromTrusted(ulid()),
					playniteId: itemPlayniteCompletionStatusId,
					name: item.CompletionStatus.Name,
					lastUpdatedAt: now,
					createdAt: now,
				});
				completionStatuses.set(itemPlayniteCompletionStatusId, newCompletionStatus);
				itemCompletionStatus = newCompletionStatus;
			}
		}

		const playniteGameId = PlayniteGameIdParser.fromExternal(item.Id);
		const existingGame = context.games.get(playniteGameId) ?? games.get(playniteGameId);

		const developerIds = itemDevelopers.values().toArray();
		const genreIds = itemGenres.values().toArray();
		const publisherIds = itemPublishers.values().toArray();
		const platformIds = itemPlatforms.values().toArray();

		if (existingGame) {
			const existingSnapshot = existingGame.getPlayniteSnapshot();
			const playniteSnapshot: PlayniteGameSnapshot | null = existingSnapshot
				? {
						...existingSnapshot,
						id: playniteGameId,
						name: item.Name ?? null,
						added: item.Added ? new Date(item.Added) : null,
						description: item.Description ?? null,
						hidden: item.Hidden,
						installDirectory: item.InstallDirectory ?? null,
						isInstalled: item.IsInstalled,
						lastActivity: item.LastActivity ? new Date(item.LastActivity) : null,
						playtime: item.Playtime,
						releaseDate: item.ReleaseDate ? new Date(item.ReleaseDate) : null,
						completionStatusId: itemCompletionStatus?.getId() ?? null,
					}
				: null;

			const didUpdate = existingGame.updateFromPlaynite({
				contentHash: item.ContentHash,
				playniteSnapshot,
				relationships: { developerIds, genreIds, platformIds, publisherIds },
			});
			if (didUpdate) games.set(playniteGameId, existingGame);
		} else {
			const playniteSnapshot: PlayniteGameSnapshot = {
				id: playniteGameId,
				name: item.Name ?? null,
				added: item.Added ? new Date(item.Added) : null,
				description: item.Description ?? null,
				hidden: item.Hidden,
				installDirectory: item.InstallDirectory ?? null,
				isInstalled: item.IsInstalled,
				lastActivity: item.LastActivity ? new Date(item.LastActivity) : null,
				playtime: item.Playtime,
				releaseDate: item.ReleaseDate ? new Date(item.ReleaseDate) : null,
				completionStatusId: itemCompletionStatus?.getId() ?? null,
				backgroundImagePath: item.BackgroundImage ?? null,
				coverImagePath: item.CoverImage ?? null,
				iconImagePath: item.Icon ?? null,
			};

			const newGame = gameFactory.create({
				id: GameIdParser.fromTrusted(ulid()),
				playniteSnapshot,
				developerIds: developerIds,
				genreIds: genreIds,
				publisherIds: publisherIds,
				platformIds: platformIds,
				completionStatusId: null,
				lastUpdatedAt: now,
				createdAt: now,
				contentHash: item.ContentHash,
			});
			games.set(playniteGameId, newGame);
		}

		return games.get(playniteGameId);
	};

	for (const item of payload.toAdd) {
		const game = processCommandItem(item);
		if (game) added.push(game.getId());
	}

	for (const item of payload.toUpdate) {
		const game = processCommandItem(item);
		if (game) updated.push(game.getId());
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
				deleted.push(existingGame.getId());
			}
		}
	}

	return {
		genres: [...genres.values()],
		platforms: [...platforms.values()],
		companies: [...companies.values()],
		completionStatuses: [...completionStatuses.values()],
		games: [...games.values()],
		added,
		updated,
		deleted,
	};
};

export type GameLibrarySyncContext = {
	readonly games: ReadonlyMap<PlayniteGameId, Game>;
	readonly genres: ReadonlyMap<PlayniteGenreId, Genre>;
	readonly completionStatuses: ReadonlyMap<PlayniteCompletionStatusId, CompletionStatus>;
	readonly platforms: ReadonlyMap<PlaynitePlatformId, Platform>;
	readonly companies: ReadonlyMap<PlayniteCompanyId, Company>;
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
	const games = new Map<PlayniteGameId, Game>();

	for (const game of _games) {
		const playniteGameId = game.getPlayniteSnapshot()?.id;
		if (playniteGameId) games.set(playniteGameId, game);
	}

	const _genres = genreRepository.all();
	const genres = new Map<PlayniteGenreId, Genre>();

	for (const genre of _genres) {
		const playniteGenreId = genre.getPlayniteSnapshot()?.id;
		if (playniteGenreId) genres.set(playniteGenreId, genre);
	}

	const _platforms = platformRepository.all();
	const platforms = new Map<PlaynitePlatformId, Platform>();

	for (const platform of _platforms) {
		const playnitePlatformId = platform.getPlayniteSnapshot()?.id;
		if (playnitePlatformId) platforms.set(playnitePlatformId, platform);
	}

	const _completionStatuses = completionStatusRepository.all();
	const completionStatuses = new Map<PlayniteCompletionStatusId, CompletionStatus>();

	for (const completionStatus of _completionStatuses) {
		const playniteCompletionStatusId = completionStatus.getPlayniteId();
		if (playniteCompletionStatusId)
			completionStatuses.set(playniteCompletionStatusId, completionStatus);
	}

	const _companies = companyRepository.all();
	const companies = new Map<PlayniteCompanyId, Company>();

	for (const company of _companies) {
		const playniteCompanyId = company.getPlayniteId();
		if (playniteCompanyId) companies.set(playniteCompanyId, company);
	}

	return {
		games,
		genres,
		platforms,
		completionStatuses,
		companies,
	};
};
