import { type EntityMapper } from "@playatlas/common/application";
import {
	CompletionStatusIdParser,
	GameIdParser,
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
	const Tags = game.relationships.tags.isLoaded() ? game.relationships.tags.get() : [];
	const playniteSnapshot = game.getPlayniteSnapshot();

	const dto: GameResponseDto = {
		Id: game.getId(),
		Playnite: playniteSnapshot
			? {
					Id: playniteSnapshot.id,
					Name: playniteSnapshot.name,
					Description: playniteSnapshot.description,
					ReleaseDate: playniteSnapshot.releaseDate?.toISOString() ?? null,
					Playtime: playniteSnapshot.playtime,
					LastActivity: playniteSnapshot.lastActivity?.toISOString() ?? null,
					Added: playniteSnapshot.added?.toISOString() ?? null,
					InstallDirectory: playniteSnapshot.installDirectory,
					IsInstalled: playniteSnapshot.isInstalled,
					Hidden: playniteSnapshot.hidden,
					CompletionStatusId: playniteSnapshot.completionStatusId,
					BackgroundImagePath: game.getBackgroundImagePath(),
					CoverImagePath: game.getCoverImagePath(),
					IconImagePath: game.getIconImagePath(),
				}
			: null,
		CompletionStatusId: game.getCompletionStatusId(),
		ContentHash: game.getContentHash(),
		Developers,
		Publishers,
		Genres,
		Platforms,
		Tags,
		Sync: {
			LastUpdatedAt: game.getLastUpdatedAt().toISOString(),
			DeletedAt: game.getDeletedAt()?.toISOString() ?? null,
			DeleteAfter: game.getDeleteAfter()?.toISOString() ?? null,
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
				PlayniteId: playniteSnapshot?.id ?? null,
				PlayniteName: playniteSnapshot?.name ?? null,
				PlayniteDescription: playniteSnapshot?.description ?? null,
				PlayniteReleaseDate: playniteSnapshot?.releaseDate?.toISOString() ?? null,
				PlaynitePlaytime: playniteSnapshot?.playtime ?? 0,
				PlayniteLastActivity: playniteSnapshot?.lastActivity?.toISOString() ?? null,
				PlayniteAdded: playniteSnapshot?.added?.toISOString() ?? null,
				PlayniteInstallDirectory: playniteSnapshot?.installDirectory ?? null,
				PlayniteIsInstalled: playniteSnapshot ? +playniteSnapshot?.isInstalled : 0,
				PlayniteHidden: playniteSnapshot ? +playniteSnapshot?.hidden : 0,
				PlayniteCompletionStatusId: playniteSnapshot?.completionStatusId ?? null,
				PlayniteBackgroundImagePath: playniteSnapshot?.backgroundImagePath ?? null,
				PlayniteCoverImagePath: playniteSnapshot?.coverImagePath ?? null,
				PlayniteIconImagePath: playniteSnapshot?.iconImagePath ?? null,
				CompletionStatusId: game.getCompletionStatusId(),
				ContentHash: game.getContentHash(),
				LastUpdatedAt: game.getLastUpdatedAt().toISOString(),
				CreatedAt: game.getCreatedAt().toISOString(),
				DeletedAt: game.getDeletedAt()?.toISOString() ?? null,
				DeleteAfter: game.getDeleteAfter()?.toISOString() ?? null,
			};
			return record;
		},
		toDomain: (
			game: GameModel,
			relationships: MakeGameRelationshipProps = {
				developerIds: null,
				genreIds: null,
				platformIds: null,
				publisherIds: null,
				tagIds: null,
			},
		): Game => {
			const entity: Game = gameFactory.rehydrate({
				id: GameIdParser.fromTrusted(game.Id),
				playniteSnapshot: game.PlayniteId
					? {
							id: PlayniteGameIdParser.fromTrusted(game.PlayniteId),
							name: game.PlayniteName,
							description: game.PlayniteDescription,
							releaseDate: game.PlayniteReleaseDate ? new Date(game.PlayniteReleaseDate) : null,
							playtime: game.PlaynitePlaytime,
							lastActivity: game.PlayniteLastActivity ? new Date(game.PlayniteLastActivity) : null,
							added: game.PlayniteAdded ? new Date(game.PlayniteAdded) : null,
							installDirectory: game.PlayniteInstallDirectory,
							isInstalled: Boolean(game.PlayniteIsInstalled),
							hidden: Boolean(game.PlayniteHidden),
							completionStatusId: game.PlayniteCompletionStatusId
								? CompletionStatusIdParser.fromTrusted(game.PlayniteCompletionStatusId)
								: null,
							backgroundImagePath: game.PlayniteBackgroundImagePath,
							coverImagePath: game.PlayniteCoverImagePath,
							iconImagePath: game.PlayniteIconImagePath,
						}
					: null,
				developerIds: relationships.developerIds,
				genreIds: relationships.genreIds,
				platformIds: relationships.platformIds,
				publisherIds: relationships.publisherIds,
				tagIds: relationships.tagIds,
				completionStatusId: game.CompletionStatusId
					? CompletionStatusIdParser.fromTrusted(game.CompletionStatusId)
					: null,
				contentHash: game.ContentHash,
				lastUpdatedAt: new Date(game.LastUpdatedAt),
				createdAt: new Date(game.CreatedAt),
				deletedAt: game.DeletedAt ? new Date(game.DeletedAt) : null,
				deleteAfter: game.DeleteAfter ? new Date(game.DeleteAfter) : null,
			});
			return entity;
		},
		toDto: _toDto,
		toDtoList: (games: Game[]): GameResponseDto[] => {
			return games.map(_toDto);
		},
	};
};
