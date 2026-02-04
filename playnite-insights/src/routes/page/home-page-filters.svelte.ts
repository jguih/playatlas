import { pushState } from "$app/navigation";
import { page } from "$app/state";
import type { GetGamesQueryFilter, GetGamesQuerySort } from "$lib/modules/common/queries";

export const homePageFiltersSignal: GetGamesQueryFilter = $state({});
export const homePageSortSignal: GetGamesQuerySort = $state({
	type: "recentlyUpdated",
	direction: "desc",
});

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
