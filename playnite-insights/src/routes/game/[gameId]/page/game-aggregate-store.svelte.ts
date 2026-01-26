import type { ClientApiGetter } from "$lib/modules/bootstrap/application";
import type { Company, CompletionStatus, Game, GameId } from "$lib/modules/game-library/domain";

type GameAggregateStoreDeps = {
	api: ClientApiGetter;
	getGameId: () => GameId;
};

export class GameAggregateStore {
	private readonly api: ClientApiGetter;
	private readonly getGameId: () => GameId;

	game: Game | null;
	completionStatus: CompletionStatus | null;
	developers: Company[];
	publishers: Company[];

	constructor({ api, getGameId }: GameAggregateStoreDeps) {
		this.api = api;
		this.getGameId = getGameId;

		this.game = $state(null);
		this.completionStatus = $state(null);
		this.developers = $state([]);
		this.publishers = $state([]);
	}

	private loadPublishersAsync = async () => {
		if (!this.game || this.game.Publishers.length === 0) return;

		const { companies } = await this.api().GameLibrary.Query.GetCompaniesByIds.executeAsync({
			companyIds: this.game.Publishers,
		});
		this.publishers = companies;
	};

	private loadDevelopersAsync = async () => {
		if (!this.game || this.game.Developers.length === 0) return;

		const { companies } = await this.api().GameLibrary.Query.GetCompaniesByIds.executeAsync({
			companyIds: this.game.Developers,
		});
		this.developers = companies;
	};

	private loadCompletionStatusAsync = async () => {
		if (!this.game || !this.game.CompletionStatusId) return;

		const { completionStatuses } =
			await this.api().GameLibrary.Query.GetCompletionStatusesByIds.executeAsync({
				completionStatusesIds: [this.game.CompletionStatusId],
			});
		this.completionStatus = completionStatuses.at(0) ?? null;
	};

	initAsync = async () => {
		const gameId = this.getGameId();

		const { games } = await this.api().GameLibrary.Query.GetGamesByIds.executeAsync({
			gameIds: [gameId],
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
