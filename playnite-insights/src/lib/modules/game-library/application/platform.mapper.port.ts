import type { IClientEntityMapper } from "$lib/modules/common/common";
import type { PlatformResponseDto } from "@playatlas/game-library/dtos";
import type { Platform, PlatformId } from "../domain";
import type { PlatformModel } from "../infra/platform.repository";

export type IPlatformMapperPort = IClientEntityMapper<PlatformId, Platform, PlatformModel> & {
	fromDto: (dto: PlatformResponseDto, lastSync?: Date | null) => Platform;
};
