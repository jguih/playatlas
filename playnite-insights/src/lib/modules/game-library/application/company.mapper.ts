import type { IClockPort } from "$lib/modules/common/application";
import type { ICompanyMapperPort } from "./company.mapper.port";

export type CompanyMapperDeps = {
	clock: IClockPort;
};

export class CompanyMapper implements ICompanyMapperPort {
	private readonly clock: IClockPort;

	constructor({ clock }: CompanyMapperDeps) {
		this.clock = clock;
	}

	toDomain: ICompanyMapperPort["toDomain"] = (dto, lastSync) => {
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
