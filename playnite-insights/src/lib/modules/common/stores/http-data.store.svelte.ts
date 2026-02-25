import type { IHttpClientPort } from "../application/http-client.port";
import type { IHttpDataStorePort } from "./http-data.store.port";

export type HttpDataStoreDeps = {
	httpClient: IHttpClientPort;
};

export class HttpDataStore implements IHttpDataStorePort {
	readonly httpClient: IHttpClientPort;

	constructor({ httpClient }: HttpDataStoreDeps) {
		this.httpClient = httpClient;
	}
}
