import type { IClockPort } from "$lib/modules/common/application";
import type { ICompletionStatusMapperPort } from "./completion-status.mapper.port";

export type CompletionStatusMapperDeps = {
	clock: IClockPort;
};

export class CompletionStatusMapper implements ICompletionStatusMapperPort {
	private readonly clock: IClockPort;

	constructor({ clock }: CompletionStatusMapperDeps) {
		this.clock = clock;
	}

	toDomain: ICompletionStatusMapperPort["toDomain"] = (dto, lastSync) => {
		return {
			Id: dto.Id,
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
}
