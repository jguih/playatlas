import { ClientEntityRepository, type ClientEntityRepositoryDeps } from "$lib/modules/common/infra";
import type { SessionId, SessionIdObject } from "../domain/session-id.entity";
import type { ISessionIdRepositoryPort } from "./session-id.repository.port";
import { sessionIdRepositoryMeta } from "./session-id.repository.schema";

export type SessionIdRepositoryDeps = ClientEntityRepositoryDeps;

export class SessionIdRepository
	extends ClientEntityRepository<SessionIdObject, SessionId>
	implements ISessionIdRepositoryPort
{
	constructor({ dbSignal }: SessionIdRepositoryDeps) {
		super({ dbSignal, storeName: sessionIdRepositoryMeta.storeName });
	}

	getAsync = async (): Promise<SessionIdObject | null> => {
		return await this.runTransaction([this.storeName], "readonly", async ({ tx }) => {
			const store = tx.objectStore(this.storeName);
			const entity = await this.runRequest<SessionIdObject[]>(store.getAll());
			return entity.at(0) ?? null;
		});
	};

	setAsync = async (sessionId: SessionIdObject): Promise<void> => {
		await this.runTransaction([this.storeName], "readwrite", async ({ tx }) => {
			const store = tx.objectStore(this.storeName);
			await this.runRequest(store.clear());
			await this.runRequest(store.put(sessionId));
		});
	};
}
