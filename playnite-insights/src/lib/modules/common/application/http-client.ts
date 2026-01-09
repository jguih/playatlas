import type { IHttpClientPort } from './http-client.port';

export type HttpClientDeps = {
	getHeaders: () => Headers | Promise<Headers>;
	url: string;
};

export class HttpClient implements IHttpClientPort {
	#getHeaders: HttpClientDeps['getHeaders'];
	#url: string;

	constructor({ getHeaders, url }: HttpClientDeps) {
		this.#getHeaders = getHeaders;
		this.#url = url;
	}

	private safeJoinUrlAndEndpoint = (endpoint?: string) => {
		if (!endpoint) return this.#url;
		const parsedEndpoint = endpoint.startsWith('/')
			? endpoint.substring(1, endpoint.length)
			: endpoint;
		const parsedApiUrl = this.#url.endsWith('/') ? this.#url : `${this.#url}/`;
		return `${parsedApiUrl}${parsedEndpoint}`;
	};

	private mergeHeaders(...all: (HeadersInit | undefined)[]): Headers {
		const merged = new Headers();
		for (const h of all) {
			if (!h) continue;
			const current = new Headers(h);
			current.forEach((value, key) => {
				merged.append(key, value);
			});
		}
		return merged;
	}

	getAsync: IHttpClientPort['getAsync'] = async (endpoint, props = {}) => {
		const url = this.safeJoinUrlAndEndpoint(endpoint);
		const headers = await this.#getHeaders();
		return await fetch(url, {
			...props,
			method: 'GET',
			headers: this.mergeHeaders(headers, props.headers),
		});
	};

	postAsync: IHttpClientPort['postAsync'] = async (endpoint, props = {}) => {
		const url = this.safeJoinUrlAndEndpoint(endpoint);
		const headers = await this.#getHeaders();
		return await fetch(url, {
			...props,
			method: 'POST',
			headers: this.mergeHeaders(headers, props.headers),
		});
	};

	putAsync: IHttpClientPort['putAsync'] = async (endpoint, props = {}) => {
		const url = this.safeJoinUrlAndEndpoint(endpoint);
		const headers = await this.#getHeaders();
		return await fetch(url, {
			...props,
			method: 'PUT',
			headers: this.mergeHeaders(headers, props.headers),
		});
	};

	deleteAsync: IHttpClientPort['deleteAsync'] = async (endpoint, props = {}) => {
		const url = this.safeJoinUrlAndEndpoint(endpoint);
		const headers = await this.#getHeaders();
		return await fetch(url, {
			...props,
			method: 'DELETE',
			headers: this.mergeHeaders(headers, props.headers),
		});
	};
}
