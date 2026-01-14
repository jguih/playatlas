import type { PlatformId } from "@playatlas/common/domain";
import type { IEntityRepositoryPort } from "@playatlas/common/infra";
import type { Platform } from "../domain/platform.entity";

export type IPlatformRepositoryPort = IEntityRepositoryPort<PlatformId, Platform> & {};
