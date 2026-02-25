import { ClientEntityRepository, type ClientEntityRepositoryDeps } from "$lib/modules/common/infra";
import type { ISessionIdMapperPort } from "../application";
import type { SessionId, SessionIdAggregate } from "../domain/session-id.entity";
import type { ISessionIdRepositoryPort } from "./session-id.repository.port";
import { sessionIdRepositoryMeta } from "./session-id.repository.schema";

export type SessionIdRepositoryDeps = ClientEntityRepositoryDeps & {
	sessionIdMapper: ISessionIdMapperPort;
};

export type SessionIdModel = {
	SourceLastUpdatedAt: Date;
	SourceLastUpdatedAtMs: number;
	SessionId: string;
};

export class SessionIdRepository
	extends ClientEntityRepository<SessionId, SessionIdAggregate, SessionIdModel>
	implements ISessionIdRepositoryPort
{
	constructor({ dbSignal, sessionIdMapper }: SessionIdRepositoryDeps) {
		super({ dbSignal, storeName: sessionIdRepositoryMeta.storeName, mapper: sessionIdMapper });
	}

	getAsync = async (): Promise<SessionIdAggregate | null> => {
		return await this.runTransaction([this.storeName], "readonly", async ({ tx }) => {
			const store = tx.objectStore(this.storeName);
			const models = await this.runRequest<SessionIdModel[]>(store.getAll());
			return models.at(0) ? this.mapper.toDomain(models.at(0)!) : null;
		});
	};

	setAsync = async (sessionId: SessionIdAggregate): Promise<void> => {
		await this.runTransaction([this.storeName], "readwrite", async ({ tx }) => {
			const store = tx.objectStore(this.storeName);
			const model = this.mapper.toPersistence(sessionId);
			await this.runRequest(store.clear());
			await this.runRequest(store.put(model));
		});
	};
}
