export type ClientEntity<TEntityKey> = {
	Id: TEntityKey;
	SourceUpdatedAt: Date;
	SourceUpdatedAtMs: number;
};
