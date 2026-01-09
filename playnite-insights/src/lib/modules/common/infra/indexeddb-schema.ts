export interface IIndexedDbSchema {
	define(props: {
		db: IDBDatabase;
		tx: IDBTransaction;
		oldVersion: number;
		newVersion: number | null;
	}): void;
}
