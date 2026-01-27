import type { ClientEntity } from "$lib/modules/common/common";

export type SessionId = string & { readonly __brand: "SessionId" };

export const SessionIdParser = {
	fromTrusted: (value: string) => value as SessionId,
};

export type SessionIdAggregate = ClientEntity<SessionId> & {
	SessionId: SessionId;
};
