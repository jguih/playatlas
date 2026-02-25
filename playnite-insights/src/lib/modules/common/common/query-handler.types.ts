export interface IQueryHandlerPort<TQuery, TQueryResult> {
	execute(query: TQuery): TQueryResult;
}

export interface IAsyncQueryHandlerPort<TQuery, TQueryResult> {
	executeAsync(query: TQuery): Promise<TQueryResult>;
}
