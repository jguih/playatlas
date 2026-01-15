import {
	CompanyIdParser,
	CompletionStatusIdParser,
	GameIdParser,
	GenreIdParser,
	PlatformIdParser,
	type CompanyId,
	type CompletionStatusId,
	type GameId,
	type GenreId,
	type PlatformId,
} from "@playatlas/common/domain";
import {
	makeCompany,
	makeCompletionStatus,
	makeGame,
	makeGenre,
	makePlatform,
	type Company,
	type CompletionStatus,
	type Game,
	type Genre,
	type Platform,
} from "@playatlas/game-library/domain";
import type { SyncGamesCommand, SyncGamesCommandItem } from "./sync-games.command";

export type ExtractedSyncData = {
	genres: Genre[];
	platforms: Platform[];
	developers: Company[];
	publishers: Company[];
	completionStatuses: CompletionStatus[];
	games: Game[];
	added: GameId[];
	updated: GameId[];
	deleted: GameId[];
};

export const extractSyncData = (props: {
	command: SyncGamesCommand;
	now: Date;
}): ExtractedSyncData => {
	const {
		command: { payload },
		now,
	} = props;

	const genres = new Map<GenreId, Genre>();
	const platforms = new Map<PlatformId, Platform>();
	const developers = new Map<CompanyId, Company>();
	const publishers = new Map<CompanyId, Company>();
	const completionStatuses = new Map<CompletionStatusId, CompletionStatus>();
	const games: Game[] = [];
	const added: GameId[] = [];
	const updated: GameId[] = [];
	const deleted: GameId[] = [];

	const processCommandItem = (item: SyncGamesCommandItem) => {
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

		games.push(
			makeGame({
				id: GameIdParser.fromExternal(item.Id),
				name: item.Name,
				added: item.Added ? new Date(item.Added) : null,
				contentHash: item.ContentHash,
				backgroundImage: item.BackgroundImage,
				coverImage: item.CoverImage,
				icon: item.Icon,
				completionStatusId: item.CompletionStatus?.Id,
				description: item.Description,
				developerIds: item.Developers?.map((d) => CompanyIdParser.fromExternal(d.Id)) ?? [],
				genreIds: item.Genres?.map((g) => GenreIdParser.fromExternal(g.Id)) ?? [],
				publisherIds: item.Publishers?.map((p) => CompanyIdParser.fromExternal(p.Id)) ?? [],
				platformIds: item.Platforms?.map((p) => PlatformIdParser.fromExternal(p.Id)) ?? [],
				hidden: item.Hidden,
				installDirectory: item.InstallDirectory,
				isInstalled: item.IsInstalled,
				lastActivity: item.LastActivity ? new Date(item.LastActivity) : null,
				playtime: item.Playtime,
				releaseDate: item.ReleaseDate ? new Date(item.ReleaseDate) : null,
				lastUpdatedAt: now,
			}),
		);
	};

	for (const item of payload.toAdd) {
		processCommandItem(item);
		added.push(GameIdParser.fromExternal(item.Id));
	}

	for (const item of payload.toUpdate) {
		processCommandItem(item);
		updated.push(GameIdParser.fromExternal(item.Id));
	}

	for (const item of payload.toRemove) {
		deleted.push(GameIdParser.fromExternal(item));
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
