import type { IAsyncCommandHandlerPort } from "$lib/modules/common/common";
import type { IPlatformRepositoryPort } from "../../infra/platform.repository.port";
import type { SyncPlatformsCommand } from "./sync-platforms.command";

export type ISyncPlatformsCommandHandlerPort = IAsyncCommandHandlerPort<SyncPlatformsCommand, void>;

export type SyncPlatformsCommandHandlerDeps = {
	platformRepository: IPlatformRepositoryPort;
};

export class SyncPlatformsCommandHandler implements ISyncPlatformsCommandHandlerPort {
	private readonly platformRepository: IPlatformRepositoryPort;

	constructor({ platformRepository }: SyncPlatformsCommandHandlerDeps) {
		this.platformRepository = platformRepository;
	}

	async executeAsync(command: SyncPlatformsCommand): Promise<void> {
		await this.platformRepository.syncAsync(command.platforms);
	}
}
