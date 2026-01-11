import type { GameResponseDto } from '@playatlas/game-library/dtos';
import type { IClientEntityMapper } from '../common/common/client-entity.mapper';
import type { Game } from './domain/game.entity';

export const gameMapper: IClientEntityMapper<Game, GameResponseDto> = {
	toDomain: (dto) => {
		return {
			...dto,
			Hidden: Boolean(dto.Hidden),
			IsInstalled: Boolean(dto.IsInstalled),
			Added: dto.Added ? new Date(dto.Added) : null,
			LastActivity: dto.LastActivity ? new Date(dto.LastActivity) : null,
			ReleaseDate: dto.ReleaseDate ? new Date(dto.ReleaseDate) : null,
			SourceUpdatedAt: new Date(),
			Sync: {
				Status: 'pending',
				LastSyncedAt: new Date(),
				ErrorMessage: null,
			},
			DeletedAt: null,
			DeleteAfter: null,
		};
	},
};
