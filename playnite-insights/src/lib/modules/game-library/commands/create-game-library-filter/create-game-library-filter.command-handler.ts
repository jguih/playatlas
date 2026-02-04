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
	public static readonly MAX_FILTERS: number = 100;

	constructor(private readonly deps: CreateGameLibraryFilterCommandHandlerDeps) {}

	executeAsync: ICreateGameLibraryCommandHandler["executeAsync"] = async (command) => {
		const now = this.deps.clock.now();
		const existingFilters = await this.deps.gameLibraryFilterRepository.getByLastUsedAtDescAsync();

		const query = command.query;
		const queryVersion = CreateGameLibraryFilterCommandHandler.QUERY_VERSION;
		const hash = this.deps.hasher.computeHash({ query, queryVersion });

		const existingFilter = existingFilters.find((f) => f.Key === hash);

		if (existingFilter) {
			existingFilter.LastUsedAt = now;
			existingFilter.UseCount += 1;
			existingFilter.SourceUpdatedAt = now;
			existingFilter.SourceUpdatedAtMs = now.getTime();
			existingFilter.Query = query;

			await this.deps.gameLibraryFilterRepository.putAsync(existingFilter);
			return;
		}

		const MAX_FILTERS = CreateGameLibraryFilterCommandHandler.MAX_FILTERS;

		if (existingFilters.length >= MAX_FILTERS) {
			const toEvictCount = existingFilters.length - (MAX_FILTERS - 1);

			const toEvict = existingFilters.slice(existingFilters.length - toEvictCount);

			for (const filter of toEvict) {
				await this.deps.gameLibraryFilterRepository.deleteAsync(filter.Id);
			}
		}

		const gameLibraryFilter: GameLibraryFilter = {
			Id: GameLibraryFilterIdParser.fromTrusted(crypto.randomUUID()),
			LastUsedAt: now,
			QueryVersion: queryVersion,
			Query: query,
			SourceUpdatedAt: now,
			SourceUpdatedAtMs: now.getTime(),
			UseCount: 1,
			Key: hash,
		};

		await this.deps.gameLibraryFilterRepository.putAsync(gameLibraryFilter);
	};
}
