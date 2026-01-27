import type { SyncStatus } from "$lib/modules/common/common";
import { ClientEntityRepository, type ClientEntityRepositoryDeps } from "$lib/modules/common/infra";
import type { IPlatformMapperPort } from "../application/platform.mapper.port";
import type { Platform, PlatformId } from "../domain/platform.entity";
import type { IPlatformRepositoryPort } from "./platform.repository.port";
import { platformRepositoryMeta } from "./platform.repository.schema";

export type PlatformRepositoryDeps = ClientEntityRepositoryDeps & {
	platformMapper: IPlatformMapperPort;
};

export type PlatformModel = {
	Id: PlatformId;
	Name: string;
	SpecificationId: string;
	SourceUpdatedAt: Date;
	SourceUpdatedAtMs: number;
	SourceDeletedAt?: Date;
	SourceDeleteAfter?: Date;
	Icon?: string | null;
	Cover?: string | null;
	Background?: string | null;

	Sync: {
		Status: SyncStatus;
		ErrorMessage?: string | null;
		LastSyncedAt: Date;
	};
};

export class PlatformRepository
	extends ClientEntityRepository<PlatformId, Platform, PlatformModel>
	implements IPlatformRepositoryPort
{
	constructor({ dbSignal, platformMapper }: PlatformRepositoryDeps) {
		super({ dbSignal, storeName: platformRepositoryMeta.storeName, mapper: platformMapper });
	}
}
