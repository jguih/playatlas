import { type EntityMapper } from "@playatlas/common/application";
import { GameIdParser, PlayniteGameIdParser } from "@playatlas/common/domain";
import type { MakeGameRelationshipProps } from "./domain";
import { type Game, makeGame } from "./domain/game.entity";
import type { PlayniteProjectionResponseDto } from "./dtos/game.response.dto";
import { type GameModel } from "./infra";

export type GameMapper = EntityMapper<Game, GameModel, PlayniteProjectionResponseDto> & {
	toDomain: (model: GameModel, relationships: MakeGameRelationshipProps) => Game;
};

const _toDto = (game: Game): PlayniteProjectionResponseDto => {
	const Developers = game.relationships.developers.isLoaded()
		? game.relationships.developers.get()
		: [];
	const Publishers = game.relationships.publishers.isLoaded()
		? game.relationships.publishers.get()
		: [];
	const Genres = game.relationships.genres.isLoaded() ? game.relationships.genres.get() : [];
	const Platforms = game.relationships.platforms.isLoaded()
		? game.relationships.platforms.get()
		: [];
	const playniteSnapshot = game.getPlayniteSnapshot();

	const dto: PlayniteProjectionResponseDto = {
		Id: playniteSnapshot.id,
		Name: playniteSnapshot.name,
		Description: playniteSnapshot.description,
		ReleaseDate: playniteSnapshot.releaseDate?.toISOString() ?? null,
		Playtime: playniteSnapshot.playtime,
		LastActivity: playniteSnapshot.lastActivity?.toISOString() ?? null,
		Added: playniteSnapshot.added?.toISOString() ?? null,
		InstallDirectory: playniteSnapshot.installDirectory,
		IsInstalled: +playniteSnapshot.isInstalled,
		Hidden: +playniteSnapshot.hidden,
		CompletionStatusId: playniteSnapshot.completionStatusId,
		ContentHash: game.getContentHash(),
		Developers,
		Publishers,
		Genres,
		Platforms,
		Sync: {
			LastUpdatedAt: game.getLastUpdatedAt().toISOString(),
			DeletedAt: game.getDeletedAt()?.toISOString() ?? null,
			DeleteAfter: game.getDeleteAfter()?.toISOString() ?? null,
		},
		Assets: {
			BackgroundImagePath: game.getBackgroundImagePath(),
			CoverImagePath: game.getCoverImagePath(),
			IconImagePath: game.getIconImagePath(),
		},
	};
	return dto;
};

export const gameMapper: GameMapper = {
	toPersistence: (game: Game): GameModel => {
		const playniteSnapshot = game.getPlayniteSnapshot();
		const record: GameModel = {
			Id: game.getId(),
			PlayniteId: playniteSnapshot.id,
			PlayniteName: playniteSnapshot.name,
			PlayniteDescription: playniteSnapshot.description,
			PlayniteReleaseDate: playniteSnapshot.releaseDate?.toISOString() ?? null,
			PlaynitePlaytime: playniteSnapshot.playtime,
			PlayniteLastActivity: playniteSnapshot.lastActivity?.toISOString() ?? null,
			PlayniteAdded: playniteSnapshot.added?.toISOString() ?? null,
			PlayniteInstallDirectory: playniteSnapshot.installDirectory,
			PlayniteIsInstalled: +playniteSnapshot.isInstalled,
			PlayniteBackgroundImage: playniteSnapshot.backgroundImage,
			PlayniteCoverImage: playniteSnapshot.coverImage,
			PlayniteIcon: playniteSnapshot.icon,
			PlayniteHidden: +playniteSnapshot.hidden,
			PlayniteCompletionStatusId: playniteSnapshot.completionStatusId,
			ContentHash: game.getContentHash(),
			LastUpdatedAt: game.getLastUpdatedAt().toISOString(),
			DeletedAt: game.getDeletedAt()?.toISOString() ?? null,
			DeleteAfter: game.getDeleteAfter()?.toISOString() ?? null,
			BackgroundImagePath: game.getBackgroundImagePath(),
			CoverImagePath: game.getCoverImagePath(),
			IconImagePath: game.getIconImagePath(),
		};
		return record;
	},
	toDomain: (game: GameModel, relationships: MakeGameRelationshipProps = {}): Game => {
		const entity: Game = makeGame({
			id: GameIdParser.fromTrusted(game.Id),
			playniteSnapshot: {
				id: PlayniteGameIdParser.fromTrusted(game.PlayniteId),
				name: game.PlayniteName,
				description: game.PlayniteDescription,
				releaseDate: game.PlayniteReleaseDate ? new Date(game.PlayniteReleaseDate) : null,
				playtime: game.PlaynitePlaytime,
				lastActivity: game.PlayniteLastActivity ? new Date(game.PlayniteLastActivity) : null,
				added: game.PlayniteAdded ? new Date(game.PlayniteAdded) : null,
				installDirectory: game.PlayniteInstallDirectory,
				isInstalled: Boolean(game.PlayniteIsInstalled),
				backgroundImage: game.PlayniteBackgroundImage,
				coverImage: game.PlayniteCoverImage,
				icon: game.PlayniteIcon,
				hidden: Boolean(game.PlayniteHidden),
				completionStatusId: game.PlayniteCompletionStatusId,
			},
			developerIds: relationships.developerIds,
			genreIds: relationships.genreIds,
			platformIds: relationships.platformIds,
			publisherIds: relationships.publisherIds,
			contentHash: game.ContentHash,
			lastUpdatedAt: new Date(game.LastUpdatedAt),
			deletedAt: game.DeletedAt ? new Date(game.DeletedAt) : null,
			deleteAfter: game.DeleteAfter ? new Date(game.DeleteAfter) : null,
			backgroundImagePath: game.BackgroundImagePath,
			coverImagePath: game.CoverImagePath,
			iconImagePath: game.IconImagePath,
		});
		return entity;
	},
	toDto: _toDto,
	toDtoList: (games: Game[]): PlayniteProjectionResponseDto[] => {
		const dtos: PlayniteProjectionResponseDto[] = [];
		for (const game of games) dtos.push(_toDto(game));
		return dtos;
	},
};
