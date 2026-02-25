import type { IAsyncCommandHandlerPort } from "$lib/modules/common/common";
import type { IGameRepositoryPort } from "../../infra/game.repository.port";
import type { SyncGamesCommand } from "./sync-games.command";

export type ISyncGamesCommandHandlerPort = IAsyncCommandHandlerPort<SyncGamesCommand, void>;

export type SyncGamesCommandHandlerDeps = {
	gameRepository: IGameRepositoryPort;
};

export class SyncGamesCommandHandler implements ISyncGamesCommandHandlerPort {
	private gameRepository: IGameRepositoryPort;

	constructor({ gameRepository }: SyncGamesCommandHandlerDeps) {
		this.gameRepository = gameRepository;
	}

	executeAsync: ISyncGamesCommandHandlerPort["executeAsync"] = async (command) => {
		return await this.gameRepository.syncAsync(command.games);
	};
}
