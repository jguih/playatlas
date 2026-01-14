import type { PlatformResponseDto } from "../../dtos/platform.response.dto";
import type { IPlatformRepositoryPort } from "../../infra/platform.repository.port";

export type GetAllPlatformsQueryHandlerDeps = {
	platformRepository: IPlatformRepositoryPort;
};

export type GetAllPlatformsQueryResult =
	| { type: "not_modified" }
	| { type: "ok"; data: PlatformResponseDto[]; etag: string };
