import { getServerUtcNowResponseSchema, JsonStrategy } from '@playnite-insights/lib/client';
import type { ILogServicePort } from '../application/log-service.port';
import { HttpDataStore, type HttpDataStoreDeps } from './http-data.store.svelte';
import type { IServerTimeStorePort, ServerTimeSignal } from './server-time.store.port';

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
			const result = await this.httpClient.httpGetAsync({
				endpoint: '/api/time/now',
				strategy: new JsonStrategy(getServerUtcNowResponseSchema),
			});
			this.serverTimeSignal.utcNow = result ? new Date(result.utcNow).getTime() : null;
			this.serverTimeSignal.syncPoint = performance.now();
			return result;
		} catch (err) {
			this.#logService.error(`[loadServerTime] failed to fetch /api/time/now`, err);
			return null;
		} finally {
			this.serverTimeSignal.isLoading = false;
		}
	};
}
