import { getServerUtcNowResponseSchema } from "@playnite-insights/lib/client";
import { SvelteDate } from "svelte/reactivity";
import type { ILogServicePort } from "../application/log-service.port";
import { HttpDataStore, type HttpDataStoreDeps } from "./http-data.store.svelte";
import type { IServerTimeStorePort, ServerTimeSignal } from "./server-time.store.port";

export type ServerTimeStoreDeps = HttpDataStoreDeps & {
	logService: ILogServicePort;
};

export class ServerTimeStore extends HttpDataStore implements IServerTimeStorePort {
	#logService: ILogServicePort;
	readonly serverTimeSignal: ServerTimeSignal;

	constructor({ httpClient, logService }: ServerTimeStoreDeps) {
		super({ httpClient });
		this.#logService = logService;
		this.serverTimeSignal = $state({ utcNow: null, syncPoint: null, isLoading: false });
	}

	loadServerTime = async () => {
		try {
			this.serverTimeSignal.isLoading = true;
			const response = await this.httpClient.getAsync({ endpoint: "/api/time/now" });
			const jsonBody = await response.json();
			const { success, data } = getServerUtcNowResponseSchema.safeParse(jsonBody);
			if (success) {
				this.serverTimeSignal.utcNow = new SvelteDate(data.utcNow).getTime();
				this.serverTimeSignal.syncPoint = performance.now();
				return data;
			}
			return null;
		} catch (err) {
			this.#logService.error(`[loadServerTime] failed to fetch /api/time/now`, err);
			return null;
		} finally {
			this.serverTimeSignal.isLoading = false;
		}
	};
}
