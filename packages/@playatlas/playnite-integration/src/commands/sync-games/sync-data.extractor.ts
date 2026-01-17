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
import type { IGameFactoryPort } from "@playatlas/game-library/application";
import {
	makeCompany,
	makeCompletionStatus,
	makeGenre,
	makePlatform,
	type Company,
	type CompletionStatus,
	type Game,
	type Genre,
	type Platform,
	type PlayniteGameSnapshot,
} from "@playatlas/game-library/domain";
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

export const extractSyncData = (props: {
	command: SyncGamesCommand;
	existingGames: Map<PlayniteGameId, Game>;
	now: Date;
	gameFactory: IGameFactoryPort;
}): ExtractedSyncData => {
	const {
		command: { payload },
		now,
		existingGames,
		gameFactory,
	} = props;

	const genres = new Map<GenreId, Genre>();
	const platforms = new Map<PlatformId, Platform>();
	const developers = new Map<CompanyId, Company>();
	const publishers = new Map<CompanyId, Company>();
	const completionStatuses = new Map<CompletionStatusId, CompletionStatus>();
	const games: Game[] = [];
	const added: PlayniteGameId[] = [];
	const updated: PlayniteGameId[] = [];
	const deleted: PlayniteGameId[] = [];

	const processCommandItem = (item: SyncGamesCommandItem): Game | null => {
		const itemPlayniteGameId = PlayniteGameIdParser.fromExternal(item.Id);
		const existingGame = existingGames.has(itemPlayniteGameId)
			? existingGames.get(itemPlayniteGameId)!
			: null;

		if (existingGame && existingGame.getContentHash() === item.ContentHash) {
			return null;
		}

		item.Genres?.forEach((g) => {
			const genreId = GenreIdParser.fromExternal(g.Id);
			genres.set(genreId, makeGenre({ id: genreId, name: g.Name, lastUpdatedAt: now }));
		});

		item.Platforms?.forEach((p) => {
			const platformId = PlatformIdParser.fromExternal(p.Id);
			platforms.set(
				platformId,
				makePlatform({
					id: platformId,
					specificationId: p.SpecificationId,
					name: p.Name,
					icon: p.Icon,
					cover: p.Cover,
					background: p.Background,
					lastUpdatedAt: now,
				}),
			);
		});

		item.Developers?.forEach((d) => {
			const companyId = CompanyIdParser.fromExternal(d.Id);
			developers.set(companyId, makeCompany({ id: companyId, name: d.Name, lastUpdatedAt: now }));
		});

		item.Publishers?.forEach((p) => {
			const companyId = CompanyIdParser.fromExternal(p.Id);
			publishers.set(companyId, makeCompany({ id: companyId, name: p.Name, lastUpdatedAt: now }));
		});

		if (item.CompletionStatus) {
			const completionStatusId = CompletionStatusIdParser.fromExternal(item.CompletionStatus.Id);
			completionStatuses.set(
				completionStatusId,
				makeCompletionStatus({
					id: completionStatusId,
					name: item.CompletionStatus.Name,
					lastUpdatedAt: now,
				}),
			);
		}

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
			existingGame.setPlayniteSnapshot(playniteSnapshot);
			existingGame.setContentHash(item.ContentHash);
			existingGame.relationships.developers.set(developerIds);
			existingGame.relationships.genres.set(genreIds);
			existingGame.relationships.publishers.set(publisherIds);
			existingGame.relationships.platforms.set(platformIds);
			games.push(existingGame);
			return existingGame;
		}

		const newGame = gameFactory.create({
			id: GameIdParser.fromTrusted(crypto.randomUUID()),
			playniteSnapshot,
			developerIds: developerIds,
			genreIds: genreIds,
			publisherIds: publisherIds,
			platformIds: platformIds,
			lastUpdatedAt: now,
			contentHash: item.ContentHash,
		});

		games.push(newGame);

		return newGame;
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
		const existingGame = existingGames.has(itemPlayniteGameId)
			? existingGames.get(itemPlayniteGameId)!
			: null;

		if (existingGame) {
			existingGame.delete();
			games.push(existingGame);
			deleted.push(PlayniteGameIdParser.fromExternal(itemId));
		}
	}

	return {
		genres: [...genres.values()],
		platforms: [...platforms.values()],
		developers: [...developers.values()],
		publishers: [...publishers.values()],
		completionStatuses: [...completionStatuses.values()],
		games,
		added,
		updated,
		deleted,
	};
};
