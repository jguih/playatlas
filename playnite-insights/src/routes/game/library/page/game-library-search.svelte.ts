import { pushState } from "$app/navigation";
import { page } from "$app/state";

export class GameLibrarySearch {
	open = () => {
		pushState("", {
			showGameLibrarySearchDrawer: true,
		});
	};

	close = () => {
		history.back();
	};

	get shouldOpen() {
		return page.state.showGameLibrarySearchDrawer;
	}
}
