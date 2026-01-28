import type { GameAggregateStore } from "./game-aggregate-store.svelte";

type GameViewModelDeps = {
	gameAggregateStore: GameAggregateStore;
};

export class GameViewModel {
	private store: GameAggregateStore;

	constructor({ gameAggregateStore }: GameViewModelDeps) {
		this.store = gameAggregateStore;
	}

	getCompaniesSummary = (): string => {
		const firstDev = this.store.developers.at(0);
		const firstPublisher = this.store.publishers.at(0);

		if (firstDev?.Id === firstPublisher?.Id) return firstDev?.Name ?? "";

		if (firstDev && firstPublisher) return [firstDev.Name, firstPublisher.Name].join(", ");

		if (firstDev) return firstDev.Name;

		return firstPublisher?.Name ?? "";
	};

	getDevelopersString = (): string => {
		if (this.store.developers.length === 0) return "";
		return this.store.developers.map((d) => d.Name).join(", ");
	};

	getPublishersString = (): string => {
		if (this.store.publishers.length === 0) return "";
		return this.store.publishers.map((d) => d.Name).join(", ");
	};

	getGenresString = (): string => {
		if (this.store.genres.length === 0) return "";
		return this.store.genres.map((g) => g.Name).join(" • ");
	};
}
