export interface IQueryHandler<TQuery, TQueryResult> {
	execute(query: TQuery): TQueryResult;
}

export interface IAsyncQueryHandler<TQuery, TQueryResult> {
	executeAsync(query: TQuery): Promise<TQueryResult>;
}
