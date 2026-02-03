import type { IClockPort } from "$lib/modules/common/application";
import type { IAsyncCommandHandlerPort } from "$lib/modules/common/common";
import {
	GameLibraryFilterIdParser,
	type GameLibraryFilter,
} from "../../domain/game-library-filter";
import type { IGameLibraryFilterHasherPort } from "../../infra/game-library-filter.hasher";
import type { IGameLibraryFilterRepositoryPort } from "../../infra/game-library-filter.repository.port";
import type {
	CreateGameLibraryFilterCommand,
	CreateGameLibraryFilterCommandResult,
} from "./create-game-library-filter.command";

export type ICreateGameLibraryCommandHandler = IAsyncCommandHandlerPort<
	CreateGameLibraryFilterCommand,
	CreateGameLibraryFilterCommandResult
>;

export type CreateGameLibraryFilterCommandHandlerDeps = {
	gameLibraryFilterRepository: IGameLibraryFilterRepositoryPort;
	hasher: IGameLibraryFilterHasherPort;
	clock: IClockPort;
};

export class CreateGameLibraryFilterCommandHandler implements ICreateGameLibraryCommandHandler {
	private static readonly QUERY_VERSION: number = 1;

	constructor(private readonly deps: CreateGameLibraryFilterCommandHandlerDeps) {}

	executeAsync: ICreateGameLibraryCommandHandler["executeAsync"] = async (command) => {
		const now = this.deps.clock.now();

		const query = command.query;
		const queryVersion = CreateGameLibraryFilterCommandHandler.QUERY_VERSION;

		const hash = this.deps.hasher.computeHash({ query, queryVersion });

		const gameLibraryFilter: GameLibraryFilter = {
			Id: GameLibraryFilterIdParser.fromTrusted(crypto.randomUUID()),
			LastUsedAt: now,
			QueryVersion: queryVersion,
			Query: query,
			SourceUpdatedAt: now,
			SourceUpdatedAtMs: now.getTime(),
			UseCount: 0,
			Hash: hash,
		};

		await this.deps.gameLibraryFilterRepository.putAsync(gameLibraryFilter);
	};
}
