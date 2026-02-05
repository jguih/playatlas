import { normalize } from "$lib/modules/common/common";
import type { GameLibraryFilterAggregate } from "../domain/game-library-filter";

export type IGameLibraryFilterHasherPort = {
	computeHash: (props: {
		query: GameLibraryFilterAggregate["Query"];
		queryVersion: GameLibraryFilterAggregate["QueryVersion"];
	}) => string;
};

export class GameLibraryFilterHasher implements IGameLibraryFilterHasherPort {
	computeHash: IGameLibraryFilterHasherPort["computeHash"] = ({ query, queryVersion }) => {
		const canonical = {
			v: queryVersion,
			sort: {
				type: query.sort.type,
				direction: query.sort.direction ?? null,
			},
			filter: query.filter
				? {
						installed: query.filter.installed ?? null,
						search: query.filter.search ? normalize(query.filter.search) : null,
					}
				: null,
		};

		return JSON.stringify(canonical);
	};
}
