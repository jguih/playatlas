import type { GameLibraryFilter } from "../domain/game-library-filter";

export type IGameLibraryFilterHasherPort = {
	computeHash: (props: {
		query: GameLibraryFilter["Query"];
		queryVersion: GameLibraryFilter["QueryVersion"];
	}) => string;
};

export class GameLibraryFilterHasher implements IGameLibraryFilterHasherPort {
	computeHash: IGameLibraryFilterHasherPort["computeHash"] = ({ query, queryVersion }) => {
		const canonical = {
			v: queryVersion,

			sort: {
				type: query.Sort.type,
				direction: query.Sort.direction ?? null,
			},

			filter: query.Filter
				? {
						installed: query.Filter.installed ?? null,
						search: query.Filter.search?.trim().toLowerCase() ?? null,
					}
				: null,
		};

		return JSON.stringify(canonical);
	};
}
