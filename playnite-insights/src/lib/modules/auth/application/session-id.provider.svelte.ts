import type { IClockPort } from "$lib/modules/common/application";
import type { SessionId, SessionIdAggregate } from "../domain";
import type { ISessionIdRepositoryPort } from "../infra";
import type { ISessionIdProviderPort } from "./session-id.provider.port";

export type SessionIdProviderDeps = {
	sessionIdRepository: ISessionIdRepositoryPort;
	clock: IClockPort;
};

export class SessionIdProvider implements ISessionIdProviderPort {
	private readonly sessionIdRepository: ISessionIdRepositoryPort;
	private readonly clock: IClockPort;
	private sessionIdSignal: SessionId | null;

	constructor({ sessionIdRepository, clock }: SessionIdProviderDeps) {
		this.sessionIdRepository = sessionIdRepository;
		this.clock = clock;
		this.sessionIdSignal = $state(null);
	}

	async getAsync(): Promise<SessionId | null> {
		if (this.sessionIdSignal) return this.sessionIdSignal;

		const sessionIdObject = await this.sessionIdRepository.getAsync();
		return sessionIdObject ? sessionIdObject.SessionId : null;
	}

	async setAsync(sessionId: SessionId): Promise<void> {
		const now = this.clock.now();

		const sessionIdObject: SessionIdAggregate = {
			Id: sessionId,
			SessionId: sessionId,
			SourceUpdatedAt: now,
			SourceUpdatedAtMs: now.getTime(),
		};

		await this.sessionIdRepository.setAsync(sessionIdObject);

		this.sessionIdSignal = sessionId;
	}

	async loadFromDbAsync(): Promise<void> {
		const sessionIdObject = await this.sessionIdRepository.getAsync();
		if (sessionIdObject) this.sessionIdSignal = sessionIdObject.SessionId;
	}
}
