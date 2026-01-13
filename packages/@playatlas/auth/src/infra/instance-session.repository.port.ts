import type { IEntityRepositoryPort } from "@playatlas/common/infra";
import type {
  InstanceSession,
  InstanceSessionId,
} from "../domain/instance-session.entity";

export type InstanceSessionRepository = IEntityRepositoryPort<
  InstanceSessionId,
  InstanceSession
>;
