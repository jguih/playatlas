import type { SessionId } from "../domain";

export interface ISessionIdProvider {
	getAsync: () => Promise<SessionId | null>;
	setAsync: (sessionId: SessionId) => Promise<void>;
	loadFromDbAsync: () => Promise<void>;
}
