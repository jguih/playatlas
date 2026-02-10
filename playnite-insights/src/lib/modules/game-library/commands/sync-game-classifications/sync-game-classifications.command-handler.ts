import type { IAsyncCommandHandlerPort } from "$lib/modules/common/common";
import type { IGameClassificationRepositoryPort } from "../../infra/scoring-engine/game-classification.repository.port";
import type { SyncGameClassificationsCommand } from "./sync-game-classifications.command";

export type ISyncGameClassificationsCommandHandlerPort = IAsyncCommandHandlerPort<
	SyncGameClassificationsCommand,
	void
>;

export type SyncGameClassificationsCommandHandlerDeps = {
	gameClassificationsRepository: IGameClassificationRepositoryPort;
};

export class SyncGameClassificationsCommandHandler implements ISyncGameClassificationsCommandHandlerPort {
	constructor(private readonly deps: SyncGameClassificationsCommandHandlerDeps) {}

	executeAsync: ISyncGameClassificationsCommandHandlerPort["executeAsync"] = async (command) => {
		return await this.deps.gameClassificationsRepository.syncAsync(command.gameClassifications);
	};
}
