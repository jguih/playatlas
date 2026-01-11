export type HttpClientSearchParams = Record<string, string | number | boolean | null | undefined>;

export type HttpClientCommonFnProps = {
	endpoint: string;
	searchParams?: HttpClientSearchParams;
};

export type HttpClientCommonFnExtraArgs = Omit<RequestInit, 'method'>;
