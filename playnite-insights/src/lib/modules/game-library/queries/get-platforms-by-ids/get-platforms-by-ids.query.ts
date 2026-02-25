import type { Platform, PlatformId } from "../../domain/platform.entity";

export type GetPlatformsByIdsQuery = {
	platformIds: PlatformId[];
};

export type GetPlatformsByIdsQueryResult = {
	platforms: Platform[];
};
