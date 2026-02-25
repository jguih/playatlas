import type { IClockPort } from "$lib/modules/common/application";
import { CompletionStatusIdParser } from "../domain";
import type { ICompletionStatusMapperPort } from "./completion-status.mapper.port";

export type CompletionStatusMapperDeps = {
	clock: IClockPort;
};

export class CompletionStatusMapper implements ICompletionStatusMapperPort {
	private readonly clock: IClockPort;

	constructor({ clock }: CompletionStatusMapperDeps) {
		this.clock = clock;
	}

	fromDto: ICompletionStatusMapperPort["fromDto"] = (dto, lastSync) => {
		return {
			Id: CompletionStatusIdParser.fromTrusted(dto.Id),
			Name: dto.Name,
			SourceLastUpdatedAt: new Date(dto.Sync.LastUpdatedAt),
			Sync: {
				Status: "synced",
				LastSyncedAt: lastSync ?? this.clock.now(),
				ErrorMessage: null,
			},
		};
	};

	toDomain: ICompletionStatusMapperPort["toDomain"] = (model) => {
		return {
			Id: model.Id,
			Name: model.Name,
			SourceLastUpdatedAt: model.SourceLastUpdatedAt,
			Sync: model.Sync,
		};
	};

	toPersistence: ICompletionStatusMapperPort["toPersistence"] = (entity) => {
		return {
			Id: entity.Id,
			Name: entity.Name,
			SourceLastUpdatedAt: entity.SourceLastUpdatedAt,
			SourceLastUpdatedAtMs: entity.SourceLastUpdatedAt.getTime(),
			DeleteAfter: null,
			DeletedAt: null,
			Sync: entity.Sync,
		};
	};
}
