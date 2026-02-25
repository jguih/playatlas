export type HttpResponseParser<T> = (response: Response) => Promise<T>;
