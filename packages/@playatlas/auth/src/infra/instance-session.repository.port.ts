import type { IEntityRepositoryPort } from "@playatlas/common/infra";
import type { InstanceSession } from "../domain/instance-session.entity";
import type { SessionId } from "../domain/value-object/session-id";

export type IInstanceSessionRepositoryPort = IEntityRepositoryPort<SessionId, InstanceSession>;
