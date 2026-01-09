import type { IHttpDataStorePort } from './http-data.store.port';

export type ServerTimeSignal = {
	utcNow: number | null;
	syncPoint: number | null;
	isLoading: boolean;
};

export interface IServerTimeStorePort extends IHttpDataStorePort {
	loadServerTime: () => Promise<{ utcNow: string } | null>;
	get serverTimeSignal(): ServerTimeSignal;
}
