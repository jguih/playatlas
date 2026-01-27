import type { IClockPort } from "$lib/modules/common/application";
import { PlatformIdParser } from "../domain";
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
			SourceUpdatedAt: new Date(dto.Sync.LastUpdatedAt),
			SourceUpdatedAtMs: new Date(dto.Sync.LastUpdatedAt).getTime(),
			Background: dto.Background,
			Cover: dto.Cover,
			Icon: dto.Icon,
			SpecificationId: dto.SpecificationId,
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
			SpecificationId: model.SpecificationId,
			SourceUpdatedAt: model.SourceUpdatedAt,
			SourceUpdatedAtMs: model.SourceUpdatedAtMs,
			Background: model.Background ?? null,
			Cover: model.Cover ?? null,
			Icon: model.Icon ?? null,
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
			SpecificationId: entity.SpecificationId,
			SourceUpdatedAt: entity.SourceUpdatedAt,
			SourceUpdatedAtMs: entity.SourceUpdatedAtMs,
			Sync: entity.Sync,
		};
	};
}
