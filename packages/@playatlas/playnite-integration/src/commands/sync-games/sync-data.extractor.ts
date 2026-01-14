import {
	CompanyIdParser,
	CompletionStatusIdParser,
	GameIdParser,
	GenreIdParser,
	PlatformIdParser,
	type CompanyId,
	type CompletionStatusId,
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
import { type SyncGamesCommandItem } from "./sync-games.command";

export type ExtractedSyncData = {
	genres: Genre[];
	platforms: Platform[];
	developers: Company[];
	publishers: Company[];
	completionStatuses: CompletionStatus[];
	games: Game[];
};

export const extractSyncData = (items: SyncGamesCommandItem[]): ExtractedSyncData => {
	const genres = new Map<GenreId, Genre>();
	const platforms = new Map<PlatformId, Platform>();
	const developers = new Map<CompanyId, Company>();
	const publishers = new Map<CompanyId, Company>();
	const completionStatuses = new Map<CompletionStatusId, CompletionStatus>();
	const games: Game[] = [];

	for (const dto of items) {
		dto.Genres?.forEach((g) => {
			const genreId = GenreIdParser.fromExternal(g.Id);
			genres.set(genreId, makeGenre({ id: genreId, name: g.Name }));
		});

		dto.Platforms?.forEach((p) => {
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
				}),
			);
		});

		dto.Developers?.forEach((d) => {
			const companyId = CompanyIdParser.fromExternal(d.Id);
			developers.set(companyId, makeCompany({ id: companyId, name: d.Name }));
		});

		dto.Publishers?.forEach((p) => {
			const companyId = CompanyIdParser.fromExternal(p.Id);
			publishers.set(companyId, makeCompany({ id: companyId, name: p.Name }));
		});

		if (dto.CompletionStatus) {
			const completionStatusId = CompletionStatusIdParser.fromExternal(dto.CompletionStatus.Id);
			completionStatuses.set(
				completionStatusId,
				makeCompletionStatus({
					id: completionStatusId,
					name: dto.CompletionStatus.Name,
				}),
			);
		}

		games.push(
			makeGame({
				id: GameIdParser.fromExternal(dto.Id),
				name: dto.Name,
				added: dto.Added ? new Date(dto.Added) : null,
				contentHash: dto.ContentHash,
				backgroundImage: dto.BackgroundImage,
				coverImage: dto.CoverImage,
				icon: dto.Icon,
				completionStatusId: dto.CompletionStatus?.Id,
				description: dto.Description,
				developerIds: dto.Developers?.map((d) => CompanyIdParser.fromExternal(d.Id)) ?? [],
				genreIds: dto.Genres?.map((g) => GenreIdParser.fromExternal(g.Id)) ?? [],
				publisherIds: dto.Publishers?.map((p) => CompanyIdParser.fromExternal(p.Id)) ?? [],
				platformIds: dto.Platforms?.map((p) => PlatformIdParser.fromExternal(p.Id)) ?? [],
				hidden: dto.Hidden,
				installDirectory: dto.InstallDirectory,
				isInstalled: dto.IsInstalled,
				lastActivity: dto.LastActivity ? new Date(dto.LastActivity) : null,
				playtime: dto.Playtime,
				releaseDate: dto.ReleaseDate ? new Date(dto.ReleaseDate) : null,
			}),
		);
	}

	return {
		genres: [...genres.values()],
		platforms: [...platforms.values()],
		developers: [...developers.values()],
		publishers: [...publishers.values()],
		completionStatuses: [...completionStatuses.values()],
		games,
	};
};
