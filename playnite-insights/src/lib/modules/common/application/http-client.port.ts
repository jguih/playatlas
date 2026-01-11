import type { HttpClientCommonFnExtraArgs, HttpClientCommonFnProps } from './http-client.types';

export interface IHttpClientPort {
	getAsync: (
		props: HttpClientCommonFnProps,
		extraArgs?: HttpClientCommonFnExtraArgs,
	) => Promise<Response>;
	postAsync: (
		props: HttpClientCommonFnProps,
		extraArgs?: HttpClientCommonFnExtraArgs,
	) => Promise<Response>;
	putAsync: (
		props: HttpClientCommonFnProps,
		extraArgs?: HttpClientCommonFnExtraArgs,
	) => Promise<Response>;
	deleteAsync: (
		props: HttpClientCommonFnProps,
		extraArgs?: HttpClientCommonFnExtraArgs,
	) => Promise<Response>;
}
