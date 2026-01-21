import type { IEntityRepositoryPort } from "@playatlas/common/infra";
import type { InstanceSession } from "../domain/instance-session.entity";
import type { InstanceSessionId } from "../domain/value-object/instance-session-id";

export type IInstanceSessionRepositoryPort = IEntityRepositoryPort<
	InstanceSessionId,
	InstanceSession
>;
