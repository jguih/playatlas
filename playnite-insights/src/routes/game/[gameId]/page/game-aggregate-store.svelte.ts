import type { ClientApiGetter } from "$lib/modules/bootstrap/application";
import {
	CompanyIdParser,
	CompletionStatusIdParser,
	GenreIdParser,
	PlatformIdParser,
	type Company,
	type CompletionStatus,
	type Game,
	type GameId,
	type Genre,
	type Platform,
} from "$lib/modules/game-library/domain";

type GameAggregateStoreDeps = {
	api: ClientApiGetter;
	getGameId: () => GameId;
};

export class GameAggregateStore {
	game: Game | null = $state(null);
	completionStatus: CompletionStatus | null = $state(null);
	developers: Company[] = $state([]);
	publishers: Company[] = $state([]);
	genres: Genre[] = $state([]);
	platforms: Platform[] = $state([]);

	constructor(private readonly deps: GameAggregateStoreDeps) {}

	private loadPublishersAsync = async () => {
		if (!this.game || this.game.Publishers.length === 0) return;

		const { companies } = await this.deps.api().GameLibrary.Query.GetCompaniesByIds.executeAsync({
			companyIds: this.game.Publishers.map(CompanyIdParser.fromTrusted),
		});
		this.publishers = companies;
	};

	private loadDevelopersAsync = async () => {
		if (!this.game || this.game.Developers.length === 0) return;

		const { companies } = await this.deps.api().GameLibrary.Query.GetCompaniesByIds.executeAsync({
			companyIds: this.game.Developers.map(CompanyIdParser.fromTrusted),
		});
		this.developers = companies;
	};

	private loadCompletionStatusAsync = async () => {
		if (!this.game || !this.game.CompletionStatusId) return;

		const { completionStatuses } = await this.deps
			.api()
			.GameLibrary.Query.GetCompletionStatusesByIds.executeAsync({
				completionStatusesIds: [CompletionStatusIdParser.fromTrusted(this.game.CompletionStatusId)],
			});
		this.completionStatus = completionStatuses.at(0) ?? null;
	};

	private loadGenresAsync = async () => {
		if (!this.game || this.game.Genres.length === 0) return;

		const { genres } = await this.deps.api().GameLibrary.Query.GetGenresByIds.executeAsync({
			genreIds: this.game.Genres.map(GenreIdParser.fromTrusted),
		});
		this.genres = genres;
	};

	private loadPlatformsAsync = async () => {
		if (!this.game || this.game.Platforms.length === 0) return;

		const { platforms } = await this.deps.api().GameLibrary.Query.GetPlatformsByIds.executeAsync({
			platformIds: this.game.Platforms.map(PlatformIdParser.fromTrusted),
		});
		this.platforms = platforms;
	};

	initAsync = async () => {
		const gameId = this.deps.getGameId();

		const { games } = await this.deps.api().GameLibrary.Query.GetGamesByIds.executeAsync({
			gameIds: [gameId],
		});

		this.game = games.at(0) ?? null;

		if (!this.game) return;

		await this.loadCompletionStatusAsync();
		await this.loadDevelopersAsync();
		await this.loadPublishersAsync();
		await this.loadGenresAsync();
		await this.loadPlatformsAsync();
	};
}
