import { pushState } from "$app/navigation";
import { page } from "$app/state";

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
