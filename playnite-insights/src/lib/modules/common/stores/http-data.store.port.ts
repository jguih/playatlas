import type { IHttpClientPort } from '../application/http-client.port';

export interface IHttpDataStorePort {
	get httpClient(): IHttpClientPort;
}
