import type { EntityMapper } from "@playatlas/common/application";
import {
  rehydrateInstanceSession,
  type InstanceSession,
} from "./domain/instance-session.entity";
import type { InstanceSessionModel } from "./infra/instance-session.repository";

export const instanceSessionMapper: EntityMapper<
  InstanceSession,
  InstanceSessionModel
> = {
  toDomain: (model) => {
    const entity: InstanceSession = rehydrateInstanceSession({
      sessionId: model.Id,
      createdAt: new Date(model.CreatedAt),
      lastUsedAt: new Date(model.LastUsedAt),
    });
    return entity;
  },
  toPersistence: (entity) => {
    const model: InstanceSessionModel = {
      Id: entity.getId(),
      CreatedAt: entity.getCreatedAt().toISOString(),
      LastUsedAt: entity.getLastUsedAt().toISOString(),
    };
    return model;
  },
};
