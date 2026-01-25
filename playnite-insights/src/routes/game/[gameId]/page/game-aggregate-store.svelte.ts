import type { ClientApiGetter } from "$lib/modules/bootstrap/application";
import type { CompletionStatus, Game, GameId } from "$lib/modules/game-library/domain";

type GameAggregateStoreDeps = {
	api: ClientApiGetter;
	gameId: () => GameId;
};

export class GameAggregateStore {
	private readonly api: ClientApiGetter;
	private readonly gameId: () => GameId;

	game: Game | null;
	completionStatus: CompletionStatus | null;

	constructor({ api, gameId }: GameAggregateStoreDeps) {
		this.api = api;
		this.gameId = gameId;

		this.game = $state(null);
		this.completionStatus = $state(null);
	}

	initAsync = async () => {
		const { games } = await this.api().GameLibrary.Query.GetGamesByIds.executeAsync({
			gameIds: [this.gameId()],
		});

		this.game = games.at(0) ?? null;

		if (!this.game) return;

		if (this.game.CompletionStatusId) {
			const { completionStatuses } =
				await this.api().GameLibrary.Query.GetCompletionStatusesByIds.executeAsync({
					completionStatusesIds: [this.game.CompletionStatusId],
				});
			this.completionStatus = completionStatuses.at(0) ?? null;
		}
	};
}
