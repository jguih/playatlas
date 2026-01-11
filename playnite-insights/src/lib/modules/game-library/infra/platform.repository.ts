import { ClientEntityRepository, type ClientEntityRepositoryDeps } from '$lib/modules/common/infra';
import type { Platform, PlatformId } from '../domain/platform.entity';
import type { IPlatformRepositoryPort } from './platform.repository.port';
import { platformRepositoryMeta } from './platform.repository.schema';

export type PlatformRepositoryDeps = ClientEntityRepositoryDeps;

export class PlatformRepository
	extends ClientEntityRepository<Platform, PlatformId>
	implements IPlatformRepositoryPort
{
	constructor({ indexedDbSignal }: PlatformRepositoryDeps) {
		super({ indexedDbSignal, storeName: platformRepositoryMeta.storeName });
	}
}
