import type { IClientEntityRepository } from '$lib/modules/common/infra';
import type { Platform, PlatformId } from '../domain/platform.entity';

export type IPlatformRepositoryPort = IClientEntityRepository<Platform, PlatformId>;
