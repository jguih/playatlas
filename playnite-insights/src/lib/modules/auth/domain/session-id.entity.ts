import type { ClientEntity } from "$lib/modules/common/common";

export type SessionId = string;
export type SessionIdObject = ClientEntity<SessionId> & {
	SessionId: SessionId;
};
