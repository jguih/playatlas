import type { IEntityRepositoryPort } from "@playatlas/common/infra";
import type { Platform, PlatformId } from "../domain/platform.entity";

export type IPlatformRepositoryPort = IEntityRepositoryPort<
  PlatformId,
  Platform
> & {};
