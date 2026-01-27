import type { IClockPort } from "$lib/modules/common/application";
import { GenreIdParser } from "../domain";
import type { IGenreMapperPort } from "./genre.mapper.port";

export type GenreMapperDeps = {
	clock: IClockPort;
};

export class GenreMapper implements IGenreMapperPort {
	private readonly clock: IClockPort;

	constructor({ clock }: GenreMapperDeps) {
		this.clock = clock;
	}

	fromDto: IGenreMapperPort["fromDto"] = (dto, lastSync) => {
		return {
			Id: GenreIdParser.fromTrusted(dto.Id),
			Name: dto.Name,
			SourceUpdatedAt: new Date(dto.Sync.LastUpdatedAt),
			SourceUpdatedAtMs: new Date(dto.Sync.LastUpdatedAt).getTime(),
			Sync: {
				Status: "synced",
				LastSyncedAt: lastSync ?? this.clock.now(),
				ErrorMessage: null,
			},
		};
	};

	toDomain: IGenreMapperPort["toDomain"] = (model) => {
		return {
			Id: model.Id,
			Name: model.Name,
			SourceUpdatedAt: model.SourceUpdatedAt,
			SourceUpdatedAtMs: model.SourceUpdatedAtMs,
			Sync: {
				Status: model.Sync.Status,
				ErrorMessage: model.Sync.ErrorMessage ?? null,
				LastSyncedAt: model.Sync.LastSyncedAt,
			},
		};
	};

	toPersistence: IGenreMapperPort["toPersistence"] = (entity) => {
		return {
			Id: entity.Id,
			Name: entity.Name,
			SourceUpdatedAt: entity.SourceUpdatedAt,
			SourceUpdatedAtMs: entity.SourceUpdatedAtMs,
			Sync: entity.Sync,
		};
	};
}
