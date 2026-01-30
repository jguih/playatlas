import type { IClockPort } from "$lib/modules/common/application/clock.port";
import { GameIdParser, PlayniteGameIdParser } from "../domain";
import type { IGameMapperPort } from "./game.mapper.port";

export type GameMapperDeps = {
	clock: IClockPort;
};

export class GameMapper implements IGameMapperPort {
	private readonly clock: IClockPort;

	constructor({ clock }: GameMapperDeps) {
		this.clock = clock;
	}

	fromDto: IGameMapperPort["fromDto"] = (dto, lastSync) => {
		return {
			Id: GameIdParser.fromTrusted(dto.Id),
			Playnite: {
				Id: dto.Playnite.Id ? PlayniteGameIdParser.fromTrusted(dto.Playnite.Id) : null,
				Name: dto.Playnite.Name,
				Description: dto.Playnite.Description,
				Added: dto.Playnite.Added ? new Date(dto.Playnite.Added) : null,
				CompletionStatusId: dto.Playnite.CompletionStatusId,
				Hidden: dto.Playnite.Hidden,
				InstallDirectory: dto.Playnite.InstallDirectory,
				IsInstalled: dto.Playnite.IsInstalled,
				LastActivity: dto.Playnite.LastActivity ? new Date(dto.Playnite.LastActivity) : null,
				Playtime: dto.Playnite.Playtime,
				ReleaseDate: dto.Playnite.ReleaseDate ? new Date(dto.Playnite.ReleaseDate) : null,
			},
			Assets: {
				BackgroundImagePath: dto.Assets.BackgroundImagePath,
				CoverImagePath: dto.Assets.CoverImagePath,
				IconImagePath: dto.Assets.IconImagePath,
			},
			CompletionStatusId: dto.CompletionStatusId,
			ContentHash: dto.ContentHash,
			Developers: dto.Developers,
			Publishers: dto.Publishers,
			Genres: dto.Genres,
			Platforms: dto.Platforms,
			SourceUpdatedAt: new Date(dto.Sync.LastUpdatedAt),
			SourceUpdatedAtMs: new Date(dto.Sync.LastUpdatedAt).getTime(),
			DeletedAt: dto.Sync.DeletedAt ? new Date(dto.Sync.DeletedAt) : null,
			DeleteAfter: dto.Sync.DeleteAfter ? new Date(dto.Sync.DeleteAfter) : null,
			Sync: {
				Status: "synced",
				LastSyncedAt: lastSync ?? this.clock.now(),
				ErrorMessage: null,
			},
		};
	};

	toDomain: IGameMapperPort["toDomain"] = (model) => {
		return {
			Id: GameIdParser.fromTrusted(model.Id),
			Playnite: {
				Id: model.Playnite.Id ? PlayniteGameIdParser.fromTrusted(model.Playnite.Id) : null,
				Name: model.Playnite.Name,
				Description: model.Playnite.Description,
				Added: model.Playnite.Added ? new Date(model.Playnite.Added) : null,
				CompletionStatusId: model.Playnite.CompletionStatusId,
				Hidden: model.Playnite.Hidden,
				InstallDirectory: model.Playnite.InstallDirectory,
				IsInstalled: model.Playnite.IsInstalled,
				LastActivity: model.Playnite.LastActivity ? new Date(model.Playnite.LastActivity) : null,
				Playtime: model.Playnite.Playtime,
				ReleaseDate: model.Playnite.ReleaseDate ? new Date(model.Playnite.ReleaseDate) : null,
			},
			Assets: {
				BackgroundImagePath: model.Assets.BackgroundImagePath,
				CoverImagePath: model.Assets.CoverImagePath,
				IconImagePath: model.Assets.IconImagePath,
			},
			CompletionStatusId: model.CompletionStatusId,
			ContentHash: model.ContentHash,
			Developers: model.Developers,
			Publishers: model.Publishers,
			Genres: model.Genres,
			Platforms: model.Platforms,
			SourceUpdatedAt: model.SourceUpdatedAt,
			SourceUpdatedAtMs: model.SourceUpdatedAtMs,
			DeletedAt: model.DeletedAt ?? null,
			DeleteAfter: model.DeleteAfter ?? null,
			Sync: {
				Status: model.Sync.Status,
				LastSyncedAt: model.Sync.LastSyncedAt,
				ErrorMessage: model.Sync.ErrorMessage ?? null,
			},
		};
	};

	toPersistence: IGameMapperPort["toPersistence"] = (entity) => {
		return {
			Id: entity.Id,
			SourceUpdatedAt: entity.SourceUpdatedAt,
			SourceUpdatedAtMs: entity.SourceUpdatedAtMs,
			DeleteAfter: entity.DeleteAfter,
			DeletedAt: entity.DeletedAt,
			Playnite: {
				Id: entity.Playnite.Id,
				Name: entity.Playnite.Name,
				Description: entity.Playnite.Description,
				ReleaseDate: entity.Playnite.ReleaseDate,
				Playtime: entity.Playnite.Playtime,
				LastActivity: entity.Playnite.LastActivity,
				Added: entity.Playnite.Added,
				InstallDirectory: entity.Playnite.InstallDirectory,
				IsInstalled: entity.Playnite.IsInstalled,
				Hidden: entity.Playnite.Hidden,
				CompletionStatusId: entity.Playnite.CompletionStatusId,
			},
			Assets: {
				BackgroundImagePath: entity.Assets.BackgroundImagePath,
				CoverImagePath: entity.Assets.CoverImagePath,
				IconImagePath: entity.Assets.IconImagePath,
			},
			CompletionStatusId: entity.CompletionStatusId,
			ContentHash: entity.ContentHash,
			Developers: entity.Developers,
			Genres: entity.Genres,
			Platforms: entity.Platforms,
			Publishers: entity.Publishers,
			Sync: {
				Status: entity.Sync.Status,
				LastSyncedAt: entity.Sync.LastSyncedAt,
				ErrorMessage: entity.Sync.ErrorMessage,
			},
		};
	};
}
