import { IEntityRepositoryPort } from "@playatlas/common/infra";
import {
  InstanceSession,
  InstanceSessionId,
} from "../domain/instance-session.entity";

export type InstanceSessionRepository = IEntityRepositoryPort<
  InstanceSessionId,
  InstanceSession
>;
