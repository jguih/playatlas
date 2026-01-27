import type { IClockPort } from "$lib/modules/common/application/clock.port";
import { GameIdParser } from "../domain";
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
			Name: dto.Name,
			Description: dto.Description,
			Added: dto.Added ? new Date(dto.Added) : null,
			BackgroundImagePath: dto.Assets.BackgroundImagePath,
			CoverImagePath: dto.Assets.CoverImagePath,
			IconImagePath: dto.Assets.IconImagePath,
			CompletionStatusId: dto.CompletionStatusId,
			ContentHash: dto.ContentHash,
			Developers: dto.Developers,
			Publishers: dto.Publishers,
			Genres: dto.Genres,
			Platforms: dto.Platforms,
			Hidden: Boolean(dto.Hidden),
			InstallDirectory: dto.InstallDirectory,
			IsInstalled: Boolean(dto.IsInstalled),
			LastActivity: dto.LastActivity ? new Date(dto.LastActivity) : null,
			Playtime: dto.Playtime,
			ReleaseDate: dto.ReleaseDate ? new Date(dto.ReleaseDate) : null,
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
			Id: model.Id,
			Name: model.Name,
			SourceUpdatedAt: model.SourceUpdatedAt,
			SourceUpdatedAtMs: model.SourceUpdatedAtMs,
			DeleteAfter: model.SourceDeleteAfter ?? null,
			DeletedAt: model.SourceDeletedAt ?? null,
			Added: model.Added,
			BackgroundImagePath: model.BackgroundImagePath,
			CoverImagePath: model.CoverImagePath,
			IconImagePath: model.IconImagePath,
			CompletionStatusId: model.CompletionStatusId,
			ContentHash: model.ContentHash,
			Description: model.Description,
			Developers: model.Developers,
			Publishers: model.Publishers,
			Genres: model.Genres,
			Platforms: model.Platforms,
			Hidden: model.Hidden,
			InstallDirectory: model.InstallDirectory,
			IsInstalled: model.IsInstalled,
			LastActivity: model.LastActivity,
			Playtime: model.Playtime,
			ReleaseDate: model.ReleaseDate,
			Sync: {
				Status: model.Sync.Status,
				ErrorMessage: model.Sync.ErrorMessage ?? null,
				LastSyncedAt: model.Sync.LastSyncedAt,
			},
		};
	};

	toPersistence: IGameMapperPort["toPersistence"] = (entity) => {
		return {
			Id: entity.Id,
			Name: entity.Name,
			SourceUpdatedAt: entity.SourceUpdatedAt,
			SourceUpdatedAtMs: entity.SourceUpdatedAtMs,
			SourceDeleteAfter: entity.DeleteAfter,
			SourceDeletedAt: entity.DeletedAt,
			Added: entity.Added,
			BackgroundImagePath: entity.BackgroundImagePath,
			CoverImagePath: entity.CoverImagePath,
			IconImagePath: entity.IconImagePath,
			CompletionStatusId: entity.CompletionStatusId,
			ContentHash: entity.ContentHash,
			DeleteAfter: entity.DeleteAfter,
			DeletedAt: entity.DeletedAt,
			Description: entity.Description,
			Developers: entity.Developers,
			Publishers: entity.Publishers,
			Genres: entity.Genres,
			Platforms: entity.Platforms,
			Hidden: entity.Hidden,
			InstallDirectory: entity.InstallDirectory,
			IsInstalled: entity.IsInstalled,
			LastActivity: entity.LastActivity,
			Playtime: entity.Playtime,
			ReleaseDate: entity.ReleaseDate,
			Sync: entity.Sync,
		};
	};
}
