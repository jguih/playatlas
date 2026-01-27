import type { SessionIdAggregate } from "../domain";

export type ISessionIdRepositoryPort = {
	getAsync: () => Promise<SessionIdAggregate | null>;
	setAsync: (sessionId: SessionIdAggregate) => Promise<void>;
};
