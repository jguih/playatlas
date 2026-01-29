import { type EntityMapper } from "@playatlas/common/application";
import {
	CompletionStatusIdParser,
	GameIdParser,
	PlayniteCompletionStatusIdParser,
	PlayniteGameIdParser,
} from "@playatlas/common/domain";
import type { Game } from "../domain/game.entity";
import type { MakeGameRelationshipProps } from "../domain/game.entity.types";
import type { GameResponseDto } from "../dtos";
import type { GameModel } from "../infra/game.repository";
import type { IGameFactoryPort } from "./game.factory";

export type IGameMapperPort = EntityMapper<Game, GameModel, GameResponseDto> & {
	toDomain: (model: GameModel, relationships: MakeGameRelationshipProps) => Game;
};

const _toDto = (game: Game): GameResponseDto => {
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

	const dto: GameResponseDto = {
		Id: game.getId(),
		Playnite: {
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
		},
		CompletionStatusId: game.getCompletionStatusId(),
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

export type GameMapperDeps = {
	gameFactory: IGameFactoryPort;
};

export const makeGameMapper = ({ gameFactory }: GameMapperDeps): IGameMapperPort => {
	return {
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
				CompletionStatusId: game.getCompletionStatusId(),
				ContentHash: game.getContentHash(),
				LastUpdatedAt: game.getLastUpdatedAt().toISOString(),
				CreatedAt: game.getCreatedAt().toISOString(),
				DeletedAt: game.getDeletedAt()?.toISOString() ?? null,
				DeleteAfter: game.getDeleteAfter()?.toISOString() ?? null,
				BackgroundImagePath: game.getBackgroundImagePath(),
				CoverImagePath: game.getCoverImagePath(),
				IconImagePath: game.getIconImagePath(),
			};
			return record;
		},
		toDomain: (game: GameModel, relationships: MakeGameRelationshipProps = {}): Game => {
			const entity: Game = gameFactory.rehydrate({
				id: GameIdParser.fromTrusted(game.Id),
				playniteSnapshot: {
					id: game.PlayniteId ? PlayniteGameIdParser.fromTrusted(game.PlayniteId) : null,
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
					completionStatusId: game.PlayniteCompletionStatusId
						? PlayniteCompletionStatusIdParser.fromTrusted(game.PlayniteCompletionStatusId)
						: null,
				},
				developerIds: relationships.developerIds,
				genreIds: relationships.genreIds,
				platformIds: relationships.platformIds,
				publisherIds: relationships.publisherIds,
				completionStatusId: game.CompletionStatusId
					? CompletionStatusIdParser.fromTrusted(game.CompletionStatusId)
					: null,
				contentHash: game.ContentHash,
				lastUpdatedAt: new Date(game.LastUpdatedAt),
				createdAt: new Date(game.CreatedAt),
				deletedAt: game.DeletedAt ? new Date(game.DeletedAt) : null,
				deleteAfter: game.DeleteAfter ? new Date(game.DeleteAfter) : null,
				backgroundImagePath: game.BackgroundImagePath,
				coverImagePath: game.CoverImagePath,
				iconImagePath: game.IconImagePath,
			});
			return entity;
		},
		toDto: _toDto,
		toDtoList: (games: Game[]): GameResponseDto[] => {
			return games.map(_toDto);
		},
	};
};
