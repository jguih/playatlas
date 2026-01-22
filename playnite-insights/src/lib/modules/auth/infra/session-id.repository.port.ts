import type { SessionIdObject } from "../domain";

export type ISessionIdRepositoryPort = {
	getAsync: () => Promise<SessionIdObject | null>;
	setAsync: (sessionId: SessionIdObject) => Promise<void>;
};
