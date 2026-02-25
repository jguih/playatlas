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

		const aggregate = await this.sessionIdRepository.getAsync();
		return aggregate ? aggregate.Id : null;
	}

	async setAsync(sessionId: SessionId): Promise<void> {
		const now = this.clock.now();

		const sessionIdAggregate: SessionIdAggregate = {
			Id: sessionId,
			SourceLastUpdatedAt: now,
		};

		await this.sessionIdRepository.setAsync(sessionIdAggregate);

		this.sessionIdSignal = sessionId;
	}

	async loadFromDbAsync(): Promise<void> {
		const aggregate = await this.sessionIdRepository.getAsync();
		if (aggregate) this.sessionIdSignal = aggregate.Id;
	}
}
