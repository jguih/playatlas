import type { IClockPort } from "$lib/modules/common/application";
import { CompanyIdParser } from "../domain";
import type { ICompanyMapperPort } from "./company.mapper.port";

export type CompanyMapperDeps = {
	clock: IClockPort;
};

export class CompanyMapper implements ICompanyMapperPort {
	private readonly clock: IClockPort;

	constructor({ clock }: CompanyMapperDeps) {
		this.clock = clock;
	}

	fromDto: ICompanyMapperPort["fromDto"] = (dto, lastSync) => {
		return {
			Id: CompanyIdParser.fromTrusted(dto.Id),
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

	toDomain: ICompanyMapperPort["toDomain"] = (model) => {
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

	toPersistence: ICompanyMapperPort["toPersistence"] = (entity) => {
		return {
			Id: entity.Id,
			Name: entity.Name,
			SourceUpdatedAt: entity.SourceUpdatedAt,
			SourceUpdatedAtMs: entity.SourceUpdatedAtMs,
			DeleteAfter: null,
			DeletedAt: null,
			Sync: entity.Sync,
		};
	};
}
