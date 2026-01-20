// See https://svelte.dev/docs/kit/types#app.d.ts

import type { ServerServices } from "$lib/server/setup-services";
import type { PlayAtlasApiV1 } from "@playatlas/bootstrap/application";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			services: ServerServices;
			api: PlayAtlasApiV1;
		}
		// interface PageData {}
		interface PageState {
			showFiltersSidebar?: true;
			showSearchDrawer?: true;
		}
		// interface Platform {}
	}
}

export {};
