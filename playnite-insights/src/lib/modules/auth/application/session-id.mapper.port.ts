import type { IClientEntityMapper } from "$lib/modules/common/common";
import type { SessionId, SessionIdAggregate } from "../domain";
import type { SessionIdModel } from "../infra";

export type ISessionIdMapperPort = IClientEntityMapper<
	SessionId,
	SessionIdAggregate,
	SessionIdModel
>;
