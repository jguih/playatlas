import { normalize } from "$lib/modules/common/common";
import type { GameFilter } from "./get-games.query-handler.types";

export type IGetGamesQueryHandlerFilterBuilderProps = {
	createNameFilter: (search?: string) => GameFilter;
	createNotDeletedFilter: () => GameFilter;
};

export class GetGamesQueryHandlerFilterBuilder implements IGetGamesQueryHandlerFilterBuilderProps {
	createNameFilter = (search?: string): GameFilter => {
		if (!search) {
			return () => true;
		}

		const normalizedSearch = normalize(search);

		return (game) => {
			const name = game.SearchName;
			if (!name) return false;

			return name.startsWith(normalizedSearch);
		};
	};

	createNotDeletedFilter = (): GameFilter => {
		return (game) => {
			if (game.DeletedAt) return false;
			return true;
		};
	};
}
