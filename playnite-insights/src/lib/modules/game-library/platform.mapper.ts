import type { PlatformResponseDto } from "@playatlas/game-library/dtos";
import type { IClientEntityMapper } from "../common/common/client-entity.mapper";
import type { Platform } from "./domain/platform.entity";

export const platformMapper: IClientEntityMapper<Platform, PlatformResponseDto> = {
	toDomain: (dto) => {
		return {
			...dto,
			SourceUpdatedAt: new Date(),
		};
	},
};
