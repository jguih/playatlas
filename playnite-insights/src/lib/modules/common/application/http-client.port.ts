export interface IHttpClientPort {
	getAsync: (endpoint: string, props: Omit<RequestInit, 'method'>) => Promise<Response>;
	postAsync: (endpoint: string, props: Omit<RequestInit, 'method'>) => Promise<Response>;
	putAsync: (endpoint: string, props: Omit<RequestInit, 'method'>) => Promise<Response>;
	deleteAsync: (endpoint: string, props: Omit<RequestInit, 'method'>) => Promise<Response>;
}
