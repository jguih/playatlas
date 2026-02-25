import type { IClockPort } from "$lib/modules/common/application";
import { PlatformIdParser, PlaynitePlatformIdParser } from "../domain";
import type { IPlatformMapperPort } from "./platform.mapper.port";

export type PlatformMapperDeps = {
	clock: IClockPort;
};

export class PlatformMapper implements IPlatformMapperPort {
	private readonly clock: IClockPort;

	constructor({ clock }: PlatformMapperDeps) {
		this.clock = clock;
	}

	fromDto: IPlatformMapperPort["fromDto"] = (dto, lastSync) => {
		return {
			Id: PlatformIdParser.fromTrusted(dto.Id),
			Name: dto.Name,
			Playnite: {
				Id: dto.Playnite.Id ? PlaynitePlatformIdParser.fromTrusted(dto.Playnite.Id) : null,
				SpecificationId: dto.Playnite.SpecificationId,
			},
			SourceLastUpdatedAt: new Date(dto.Sync.LastUpdatedAt),
			Sync: {
				Status: "synced",
				LastSyncedAt: lastSync ?? this.clock.now(),
				ErrorMessage: null,
			},
		};
	};

	toDomain: IPlatformMapperPort["toDomain"] = (model) => {
		return {
			Id: model.Id,
			Name: model.Name,
			Playnite: {
				Id: model.Playnite.Id,
				SpecificationId: model.Playnite.SpecificationId,
			},
			SourceLastUpdatedAt: model.SourceLastUpdatedAt,
			Sync: {
				Status: model.Sync.Status,
				ErrorMessage: model.Sync.ErrorMessage ?? null,
				LastSyncedAt: model.Sync.LastSyncedAt,
			},
		};
	};

	toPersistence: IPlatformMapperPort["toPersistence"] = (entity) => {
		return {
			Id: entity.Id,
			Name: entity.Name,
			Playnite: {
				Id: entity.Playnite.Id,
				SpecificationId: entity.Playnite.SpecificationId,
			},
			SourceLastUpdatedAt: entity.SourceLastUpdatedAt,
			SourceLastUpdatedAtMs: entity.SourceLastUpdatedAt.getTime(),
			DeleteAfter: null,
			DeletedAt: null,
			Sync: entity.Sync,
		};
	};
}
