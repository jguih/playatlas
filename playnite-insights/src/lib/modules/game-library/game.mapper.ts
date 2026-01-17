import type { PlayniteProjectionResponseDto } from "@playatlas/game-library/dtos";
import type { IClientEntityMapper } from "../common/common/client-entity.mapper";
import type { Game } from "./domain/game.entity";

export const gameMapper: IClientEntityMapper<Game, PlayniteProjectionResponseDto> = {
	toDomain: (dto) => {
		return {
			Id: dto.Id,
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
			Sync: {
				Status: "pending",
				LastSyncedAt: new Date(),
				ErrorMessage: null,
			},
			DeletedAt: null,
			DeleteAfter: null,
		};
	},
};
