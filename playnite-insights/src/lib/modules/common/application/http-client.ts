import type { IHttpClientPort } from "./http-client.port";
import type { HttpClientSearchParams } from "./http-client.types";

export type HttpClientDeps = {
	getHeaders?: () => Headers | Promise<Headers>;
	url: string;
};

export class HttpClient implements IHttpClientPort {
	private readonly getHeaders?: HttpClientDeps["getHeaders"];
	private readonly url: string;

	constructor({ getHeaders, url }: HttpClientDeps) {
		this.getHeaders = getHeaders;
		this.url = url;
	}

	private parseUrl = (endpoint: string, searchParams?: HttpClientSearchParams): URL => {
		const resolvedUrl = new URL(endpoint, this.url);

		if (searchParams) {
			for (const [key, value] of Object.entries(searchParams))
				if (value !== undefined && value !== null) resolvedUrl.searchParams.set(key, String(value));
		}

		return resolvedUrl;
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

	getAsync: IHttpClientPort["getAsync"] = async ({ endpoint, searchParams }, props = {}) => {
		const url = this.parseUrl(endpoint, searchParams);
		const headers = await this.getHeaders?.();
		return await fetch(url, {
			...props,
			method: "GET",
			headers: this.mergeHeaders(headers, props.headers),
		});
	};

	postAsync: IHttpClientPort["postAsync"] = async ({ endpoint, searchParams }, props = {}) => {
		const url = this.parseUrl(endpoint, searchParams);
		const headers = await this.getHeaders?.();
		return await fetch(url, {
			...props,
			method: "POST",
			headers: this.mergeHeaders(headers, props.headers),
		});
	};

	putAsync: IHttpClientPort["putAsync"] = async ({ endpoint, searchParams }, props = {}) => {
		const url = this.parseUrl(endpoint, searchParams);
		const headers = await this.getHeaders?.();
		return await fetch(url, {
			...props,
			method: "PUT",
			headers: this.mergeHeaders(headers, props.headers),
		});
	};

	deleteAsync: IHttpClientPort["deleteAsync"] = async ({ endpoint, searchParams }, props = {}) => {
		const url = this.parseUrl(endpoint, searchParams);
		const headers = await this.getHeaders?.();
		return await fetch(url, {
			...props,
			method: "DELETE",
			headers: this.mergeHeaders(headers, props.headers),
		});
	};
}
