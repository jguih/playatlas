import { pushState } from "$app/navigation";
import { page } from "$app/state";
import type { GetGamesQueryFilter } from "$lib/modules/game-library/queries";

export const homePageFiltersSignal: GetGamesQueryFilter = $state({});

export class HomePageFilters {
	open = () => {
		pushState("", {
			showHomePageFiltersSidebar: true,
		});
	};

	close = () => {
		history.back();
	};

	get shouldOpen() {
		return page.state.showHomePageFiltersSidebar;
	}
}
