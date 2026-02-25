export const createIndex = <TIndex extends string, IKey extends string | string[]>(
	store: IDBObjectStore,
	name: TIndex,
	keyPath: IKey,
	options?: IDBIndexParameters,
) => store.createIndex(name, keyPath, options);
