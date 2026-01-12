import { EntityRepository } from "@playatlas/common/infra";
import { Platform, PlatformId } from "../domain/platform.entity";

export type IPlatformRepositoryPort = EntityRepository<
  PlatformId,
  Platform
> & {};
