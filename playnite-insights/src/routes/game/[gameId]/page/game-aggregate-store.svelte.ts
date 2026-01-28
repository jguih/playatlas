import type { ClientApiGetter } from "$lib/modules/bootstrap/application";
import {
	CompanyIdParser,
	CompletionStatusIdParser,
	GenreIdParser,
	type Company,
	type CompletionStatus,
	type Game,
	type GameId,
	type Genre,
} from "$lib/modules/game-library/domain";

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
	genres: Genre[];

	constructor({ api, getGameId }: GameAggregateStoreDeps) {
		this.api = api;
		this.getGameId = getGameId;

		this.game = $state(null);
		this.completionStatus = $state(null);
		this.developers = $state([]);
		this.publishers = $state([]);
		this.genres = $state([]);
	}

	private loadPublishersAsync = async () => {
		if (!this.game || this.game.Publishers.length === 0) return;

		const { companies } = await this.api().GameLibrary.Query.GetCompaniesByIds.executeAsync({
			companyIds: this.game.Publishers.map(CompanyIdParser.fromTrusted),
		});
		this.publishers = companies;
	};

	private loadDevelopersAsync = async () => {
		if (!this.game || this.game.Developers.length === 0) return;

		const { companies } = await this.api().GameLibrary.Query.GetCompaniesByIds.executeAsync({
			companyIds: this.game.Developers.map(CompanyIdParser.fromTrusted),
		});
		this.developers = companies;
	};

	private loadCompletionStatusAsync = async () => {
		if (!this.game || !this.game.CompletionStatusId) return;

		const { completionStatuses } =
			await this.api().GameLibrary.Query.GetCompletionStatusesByIds.executeAsync({
				completionStatusesIds: [CompletionStatusIdParser.fromTrusted(this.game.CompletionStatusId)],
			});
		this.completionStatus = completionStatuses.at(0) ?? null;
	};

	private loadGenres = async () => {
		if (!this.game || this.game.Genres.length === 0) return;

		const { genres } = await this.api().GameLibrary.Query.GetGenresByIds.executeAsync({
			genreIds: this.game.Genres.map(GenreIdParser.fromTrusted),
		});
		this.genres = genres;
	};

	initAsync = async () => {
		const gameId = this.getGameId();

		const { games } = await this.api().GameLibrary.Query.GetGamesByIds.executeAsync({
			gameIds: [gameId],
		});

		this.game = games.at(0) ?? null;

		if (!this.game) return;

		await this.loadCompletionStatusAsync();
		await this.loadDevelopersAsync();
		await this.loadPublishersAsync();
		await this.loadGenres();
	};
}
