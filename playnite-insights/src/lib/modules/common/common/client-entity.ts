export type ClientEntity<TEntityKey> = {
	get Id(): TEntityKey;
	get SourceLastUpdatedAt(): Date;
};
