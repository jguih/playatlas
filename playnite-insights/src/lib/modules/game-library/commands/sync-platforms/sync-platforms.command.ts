import type { Platform } from '../../domain/platform.entity';

export type SyncPlatformsCommand = {
	platforms: Platform | Platform[];
};
