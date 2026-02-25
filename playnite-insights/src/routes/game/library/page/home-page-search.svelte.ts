import { pushState } from "$app/navigation";
import { page } from "$app/state";

export class HomePageSearch {
	open = () => {
		pushState("", {
			showHomePageSearchDrawer: true,
		});
	};

	close = () => {
		history.back();
	};

	get shouldOpen() {
		return page.state.showHomePageSearchDrawer;
	}
}
