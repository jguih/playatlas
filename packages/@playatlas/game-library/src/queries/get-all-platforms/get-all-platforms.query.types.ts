import type { ILogServicePort } from "@playatlas/common/application";
import type { IClockPort, SyncCursor } from "@playatlas/common/infra";
import type { IPlatformMapperPort } from "../../application/platform.mapper";
import type { PlatformResponseDto } from "../../dtos/platform.response.dto";
import type { IPlatformRepositoryPort } from "../../infra/platform.repository.port";

export type GetAllPlatformsQueryHandlerDeps = {
	platformRepository: IPlatformRepositoryPort;
	platformMapper: IPlatformMapperPort;
	logService: ILogServicePort;
	clock: IClockPort;
};

export type GetAllPlatformsQueryResult = { data: PlatformResponseDto[]; nextCursor: SyncCursor };
