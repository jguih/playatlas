import { NotAuthenticatedError } from "../errors";
import type { IHttpClientPort } from "./http-client.port";

export type AuthenticatedHttpClientDeps = {
	httpClient: IHttpClientPort;
};

export class AuthenticatedHttpClient implements IHttpClientPort {
	private readonly inner: IHttpClientPort;

	constructor({ httpClient }: AuthenticatedHttpClientDeps) {
		this.inner = httpClient;
	}

	getAsync: IHttpClientPort["getAsync"] = async (props, extra = {}) => {
		const response = await this.inner.getAsync(props, extra);
		if (response.status === 401) throw new NotAuthenticatedError();
		return response;
	};

	postAsync: IHttpClientPort["postAsync"] = async (props, extra = {}) => {
		const response = await this.inner.postAsync(props, extra);
		if (response.status === 401) throw new NotAuthenticatedError();
		return response;
	};

	putAsync: IHttpClientPort["putAsync"] = async (props, extra = {}) => {
		const response = await this.inner.putAsync(props, extra);
		if (response.status === 401) throw new NotAuthenticatedError();
		return response;
	};

	deleteAsync: IHttpClientPort["deleteAsync"] = async (props, extra = {}) => {
		const response = await this.inner.deleteAsync(props, extra);
		if (response.status === 401) throw new NotAuthenticatedError();
		return response;
	};
}
