import type { ClientApiGetter } from "$lib/modules/bootstrap/application";
import type { Company, CompletionStatus, Game, GameId } from "$lib/modules/game-library/domain";

type GameAggregateStoreDeps = {
	api: ClientApiGetter;
	gameId: () => GameId;
};

export class GameAggregateStore {
	private readonly api: ClientApiGetter;
	private readonly gameId: () => GameId;

	game: Game | null;
	completionStatus: CompletionStatus | null;
	developers: Company[];
	publishers: Company[];

	constructor({ api, gameId }: GameAggregateStoreDeps) {
		this.api = api;
		this.gameId = gameId;

		this.game = $state(null);
		this.completionStatus = $state(null);
		this.developers = $state([]);
		this.publishers = $state([]);
	}

	private loadPublishersAsync = async () => {
		if (!this.game) return;

		const { companies } = await this.api().GameLibrary.Query.GetCompaniesByIds.executeAsync({
			companyIds: this.game.Publishers,
		});
		this.publishers = companies;
	};

	private loadDevelopersAsync = async () => {
		if (!this.game) return;

		const { companies } = await this.api().GameLibrary.Query.GetCompaniesByIds.executeAsync({
			companyIds: this.game.Publishers,
		});
		this.developers = companies;
	};

	private loadCompletionStatusAsync = async () => {
		if (!this.game) return;

		if (this.game.CompletionStatusId) {
			const { completionStatuses } =
				await this.api().GameLibrary.Query.GetCompletionStatusesByIds.executeAsync({
					completionStatusesIds: [this.game.CompletionStatusId],
				});
			this.completionStatus = completionStatuses.at(0) ?? null;
		}
	};

	initAsync = async () => {
		const { games } = await this.api().GameLibrary.Query.GetGamesByIds.executeAsync({
			gameIds: [this.gameId()],
		});

		this.game = games.at(0) ?? null;

		if (!this.game) return;

		await Promise.all([
			this.loadCompletionStatusAsync(),
			this.loadDevelopersAsync(),
			this.loadPublishersAsync(),
		]);
	};
}
