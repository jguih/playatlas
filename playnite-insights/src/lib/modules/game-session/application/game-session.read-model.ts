import type { IClockPort } from "$lib/modules/common/application";
import type { ClientEntity, SyncStatus } from "$lib/modules/common/common";
import {
	GameIdParser,
	GameSessionIdParser,
	type GameId,
	type GameSessionId,
} from "$lib/modules/common/domain";
import type { GameSessionStatus } from "@playatlas/common/domain";
import type { GameSessionResponseDto } from "@playatlas/game-session/dtos";

export type GameSessionReadModel = ClientEntity<GameSessionId> &
	Readonly<{
		SourceCreatedAt: Date;
		SourceLastUpdatedAt: Date;
		SourceLastUpdatedAtMs: number;
		DeletedAt: Date | null;
		DeleteAfter: Date | null;
		GameId: GameId;
		GameName: string | null;
		StartTime: Date;
		EndTime: Date | null;
		Duration: number | null;
		Status: GameSessionStatus;

		Sync: {
			Status: SyncStatus;
			ErrorMessage?: string | null;
			LastSyncedAt: Date;
		};
	}>;

export type IGameSessionReadModelMapperPort = {
	fromDto: (dto: GameSessionResponseDto, now?: Date) => GameSessionReadModel;
};

export type GamSessionReadModelMapperDeps = {
	clock: IClockPort;
};

export class GameSessionReadModelMapper implements IGameSessionReadModelMapperPort {
	constructor(private readonly deps: GamSessionReadModelMapperDeps) {}

	fromDto: IGameSessionReadModelMapperPort["fromDto"] = (dto, now) => {
		return {
			Id: GameSessionIdParser.fromTrusted(dto.SessionId),
			SourceCreatedAt: new Date(dto.Sync.CreatedAt),
			SourceLastUpdatedAt: new Date(dto.Sync.LastUpdatedAt),
			SourceLastUpdatedAtMs: new Date(dto.Sync.LastUpdatedAt).getTime(),
			GameId: GameIdParser.fromTrusted(dto.GameId),
			GameName: dto.GameName,
			StartTime: new Date(dto.StartTime),
			Status: dto.Status,
			EndTime: dto.EndTime ? new Date(dto.EndTime) : null,
			Duration: dto.Duration,
			DeletedAt: dto.Sync.DeletedAt ? new Date(dto.Sync.DeletedAt) : null,
			DeleteAfter: dto.Sync.DeleteAfter ? new Date(dto.Sync.DeleteAfter) : null,
			Sync: {
				LastSyncedAt: now ?? this.deps.clock.now(),
				Status: "synced",
				ErrorMessage: null,
			},
		};
	};
}
