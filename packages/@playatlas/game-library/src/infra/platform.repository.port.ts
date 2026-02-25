import type { PlatformId } from "@playatlas/common/domain";
import type { IEntityRepositoryPort } from "@playatlas/common/infra";
import type { Platform } from "../domain/platform.entity";
import type { PlatformRepositoryFilters } from "./platform.repository.types";

export type IPlatformRepositoryPort = IEntityRepositoryPort<
	PlatformId,
	Platform,
	PlatformRepositoryFilters
>;
